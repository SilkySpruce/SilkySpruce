"use server";
import { Resend } from 'resend';
import { strictRatelimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { sendOrderEmails } from './sendOrderEmail';
import { calculateShippingFee } from '@/utils/shipping';

// 1. Create a secure Admin Client that bypasses RLS for backend operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

interface CheckoutPayload {
  userId?: string;
  pointsUsed: number;
  couponCode?: string | null;
  isPickup?: boolean;
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
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? '127.0.0.1';
  
  const { success } = await strictRatelimit.limit(`strict_${ip}`);
  if (!success) {
    return { success: false, error: 'Too many requests. Please try again in a minute.' };
  }

  try {
    let finalAddress = payload.customer.address;

    // -----------------------------------------------------------------
    // 0. SAVE/FETCH USER ADDRESS
    // -----------------------------------------------------------------
    if (payload.userId && !payload.isPickup) {
      // If new coordinates were passed (and it is NOT a store pickup), save them
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
      .select('id, stock_quantity, price')
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
    // 2. SECURE BACKEND PRICING & COUPON CALCULATION
    // -----------------------------------------------------------------
    const subtotal = payload.items.reduce((sum, item) => {
      const dbVariant = stockData.find(v => v.id === item.id);
      return sum + (Number(dbVariant?.price ?? item.price) * item.quantity);
    }, 0);

    const shippingFee = payload.isPickup
      ? 0
      : calculateShippingFee(
          payload.customer.latitude || 0,
          payload.customer.longitude || 0
        );

    // Re-validate Coupon on the server
    let couponDiscount = 0;
    let appliedCouponRecord: any = null;

    if (payload.couponCode) {
      const cleanCode = payload.couponCode.trim().toUpperCase();
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', cleanCode)
        .maybeSingle();

      const now = new Date();
      const isDateValid = 
        (!coupon?.start_time || new Date(coupon.start_time) <= now) &&
        (!coupon?.end_time || new Date(coupon.end_time) >= now);
      const isUsageValid = 
        coupon?.usage_limit === null || coupon.used_count < coupon.usage_limit;

      if (
        !coupon ||
        !coupon.is_active ||
        !isDateValid ||
        !isUsageValid ||
        subtotal < Number(coupon.min_order_amount || 0)
      ) {
        return { success: false, error: 'The applied coupon code is invalid or expired. Please remove it and try again.' };
      }

      if (coupon.discount_type === 'percentage') {
        couponDiscount = Math.round((subtotal * Number(coupon.discount_value)) / 100);
        if (coupon.max_discount_amount) {
          couponDiscount = Math.min(couponDiscount, Number(coupon.max_discount_amount));
        }
      } else {
        couponDiscount = Number(coupon.discount_value);
      }

      couponDiscount = Math.min(couponDiscount, subtotal);
      appliedCouponRecord = coupon;
    }

    // Verify loyalty points against real balance
    let availablePoints = 0;
    if (payload.userId) {
      const { data: pointsProfile } = await supabaseAdmin
        .from('profiles')
        .select('loyalty_points')
        .eq('id', payload.userId)
        .maybeSingle();
      availablePoints = pointsProfile?.loyalty_points || 0;
    }

    if (payload.pointsUsed < 0 || payload.pointsUsed > availablePoints) {
      return { success: false, error: 'You do not have enough loyalty points for this order.' };
    }

    // Points apply to whatever remains after coupon discount
    const remainingAfterCoupon = Math.max(0, subtotal - couponDiscount + shippingFee);
    const pointsToUse = Math.min(payload.pointsUsed, remainingAfterCoupon);

    const totalAmount = Math.max(0, subtotal - couponDiscount - pointsToUse + shippingFee);
    const isFreeOrder = totalAmount <= 0;

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
        coupon_code: appliedCouponRecord ? appliedCouponRecord.code : null,
        discount_amount: couponDiscount,
        total_amount: totalAmount,
        points_used: pointsToUse,
        points_earned: pointsEarned,
        status: 'Pending'
      }])
      .select('id')
      .single();

    if (orderError || !orderData) throw new Error(`Failed to create order: ${orderError?.message}`);

    // Increment coupon usage count if applied
    if (appliedCouponRecord) {
      await supabaseAdmin
        .from('coupons')
        .update({ used_count: appliedCouponRecord.used_count + 1 })
        .eq('id', appliedCouponRecord.id);
    }

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
      const newBalance = currentPoints - pointsToUse + pointsEarned;

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

    return { success: true, orderNumber, pointsEarned, paymentRequired: !isFreeOrder };

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}