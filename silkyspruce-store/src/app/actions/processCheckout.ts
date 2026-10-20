"use server";

import { createClient } from '@supabase/supabase-js';
import { sendOrderEmails } from './sendOrderEmail';
import { calculateShippingFee } from '@/utils/shipping';

// 1. Create a secure Admin Client that bypasses RLS for backend operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CheckoutPayload {
  userId?: string;
  pointsUsed: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    city?: string;
  };
  items: Array<{
    id: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
}

export async function processCheckout(payload: CheckoutPayload) {
  try {
    let finalAddress = payload.customer.address;

    // -----------------------------------------------------------------
    // 0. SAVE/FETCH USER ADDRESS
    // -----------------------------------------------------------------
    if (payload.userId) {
      // If new coordinates were passed, save them to the address book
      if (payload.customer.latitude && payload.customer.longitude) {
        // Clear old defaults first
        await supabaseAdmin
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', payload.userId);

        await supabaseAdmin
          .from('user_addresses')
          .insert([{
            user_id: payload.userId,
            recipient_name: `${payload.customer.firstName} ${payload.customer.lastName}`,
            phone: payload.customer.phone,
            street_address: payload.customer.address,
            city: payload.customer.city || "Unknown",
            latitude: payload.customer.latitude,
            longitude: payload.customer.longitude,
            is_default: true
          }]);
      } else {
        // Fetch existing default address
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('address')
          .eq('id', payload.userId)
          .single();
          
        if (profile?.address) {
          finalAddress = profile.address;
        }
      }
    }

    // -----------------------------------------------------------------
    // 1. INVENTORY VERIFICATION
    // -----------------------------------------------------------------
    const variantIds = payload.items.map(item => item.id);
    
    const { data: stockData, error: stockError } = await supabaseAdmin
      .from('product_variants')
      .select('id, stock_quantity')
      .in('id', variantIds);

    if (stockError || !stockData) {
      throw new Error(`Inventory check failed: ${stockError?.message}`);
    }

    for (const cartItem of payload.items) {
      const dbVariant = stockData.find(v => v.id === cartItem.id);
      
      if (!dbVariant) {
        return { success: false, error: `${cartItem.name} (${cartItem.size}) is no longer available.` };
      }
      
      if (dbVariant.stock_quantity < cartItem.quantity) {
        return { 
          success: false, 
          error: `We only have ${dbVariant.stock_quantity} left in stock for ${cartItem.name} (${cartItem.size}). Please reduce the quantity.` 
        };
      }
    }

    // -----------------------------------------------------------------
    // 2. SECURE BACKEND PRICING CALCULATION
    // -----------------------------------------------------------------
    const subtotal = payload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // The backend dynamically calculates the fee based on the exact coordinates passed.
    // If coordinates are missing, it safely falls back to the default 300 configured in the utility.
    const shippingFee = calculateShippingFee(
      payload.customer.latitude || 0,
      payload.customer.longitude || 0
    );
    
    const totalAmount = subtotal - payload.pointsUsed + shippingFee;
    
    const pointsEarned = Math.floor(totalAmount / 100);
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        order_number: orderNumber,
        user_id: payload.userId || null,
        customer_name: `${payload.customer.firstName} ${payload.customer.lastName}`,
        customer_email: payload.customer.email,
        customer_phone: payload.customer.phone,
        shipping_address: finalAddress, 
        subtotal: subtotal,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        points_used: payload.pointsUsed,
        points_earned: pointsEarned,
        status: 'Pending'
      }])
      .select('id')
      .single();

    if (orderError || !orderData) throw new Error(`Failed to create order: ${orderError?.message}`);

    // -----------------------------------------------------------------
    // 3. INSERT ITEMS & DEDUCT INVENTORY
    // -----------------------------------------------------------------
    const orderItemsToInsert = payload.items.map(item => ({
      order_id: orderData.id,
      product_id: item.id, 
      product_name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsToInsert);
    if (itemsError) throw new Error(`Failed to save items: ${itemsError?.message}`);

    for (const item of payload.items) {
      const dbVariant = stockData.find(v => v.id === item.id);
      if (dbVariant) {
        await supabaseAdmin
          .from('product_variants')
          .update({ stock_quantity: dbVariant.stock_quantity - item.quantity })
          .eq('id', dbVariant.id);
      }
    }

    // -----------------------------------------------------------------
    // 4. UPDATE LOYALTY POINTS & SEND EMAILS
    // -----------------------------------------------------------------
    if (payload.userId) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('loyalty_points')
        .eq('id', payload.userId)
        .maybeSingle();
        
      const currentPoints = profile?.loyalty_points || 0;
      const newBalance = currentPoints - payload.pointsUsed + pointsEarned;

      await supabaseAdmin
        .from('profiles')
        .upsert({ 
          id: payload.userId, 
          loyalty_points: newBalance 
        }, { onConflict: 'id' });
    }

    await sendOrderEmails({
      orderId: orderNumber,
      customer: { ...payload.customer, address: finalAddress },
      items: payload.items,
      total: totalAmount,
      shipping: shippingFee
    });

    return { success: true, orderNumber, pointsEarned };

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}