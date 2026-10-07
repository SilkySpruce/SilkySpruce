// src/app/actions/processCheckout.ts
"use server";

import { createClient } from '@supabase/supabase-js';
import { sendOrderEmails } from './sendOrderEmail';

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
    // -----------------------------------------------------------------
    // 1. INVENTORY VERIFICATION
    // -----------------------------------------------------------------
    const productNames = payload.items.map(item => item.name);
    
    // Using supabaseAdmin everywhere to ensure it never gets blocked
    const { data: stockData, error: stockError } = await supabaseAdmin
      .from('products')
      .select('id, name, stock')
      .in('name', productNames);

    if (stockError || !stockData) {
      throw new Error(`Inventory check failed: ${stockError?.message}`);
    }

    for (const cartItem of payload.items) {
      const dbProduct = stockData.find(p => p.name === cartItem.name);
      
      if (!dbProduct) {
        return { success: false, error: `${cartItem.name} is no longer available.` };
      }
      
      if (dbProduct.stock < cartItem.quantity) {
        return { 
          success: false, 
          error: `We only have ${dbProduct.stock} left in stock for ${cartItem.name}. Please reduce the quantity in your cart.` 
        };
      }
    }

    // -----------------------------------------------------------------
    // 2. CALCULATE TOTALS & CREATE ORDER
    // -----------------------------------------------------------------
    const subtotal = payload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 10000 ? 0 : 500;
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
        shipping_address: payload.customer.address,
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
      const dbProduct = stockData.find(p => p.name === item.name);
      if (dbProduct) {
        await supabaseAdmin.rpc('decrement_stock', {
          p_id: dbProduct.id,
          q_deduct: item.quantity
        });
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
        .single();
      
      const currentPoints = profile?.loyalty_points || 0;
      const newBalance = currentPoints - payload.pointsUsed + pointsEarned;

      await supabaseAdmin
        .from('profiles')
        .update({ loyalty_points: newBalance })
        .eq('id', payload.userId);
    }

    await sendOrderEmails({
      orderId: orderNumber,
      customer: payload.customer,
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