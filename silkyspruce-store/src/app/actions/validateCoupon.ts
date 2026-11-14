"use server";

import { createClient } from '@supabase/supabase-js';
import { strictRatelimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface ValidatedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
}

export async function validateCoupon(rawCode: string, subtotal: number) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? '127.0.0.1';

  // Rate limit coupon guesses to prevent brute-force scraping
  const { success } = await strictRatelimit.limit(`coupon_${ip}`);
  if (!success) {
    return { valid: false, error: 'Too many attempts. Please wait a minute and try again.' };
  }

  const code = rawCode?.trim().toUpperCase();
  if (!code) {
    return { valid: false, error: 'Please enter a promo code.' };
  }

  const { data: coupon, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .eq('code', code)
    .maybeSingle();

  if (error || !coupon) {
    return { valid: false, error: 'Invalid or unrecognized coupon code.' };
  }

  if (!coupon.is_active) {
    return { valid: false, error: 'This coupon code is no longer active.' };
  }

  const now = new Date();
  if (coupon.start_time && new Date(coupon.start_time) > now) {
    return { valid: false, error: 'This coupon code is not active yet.' };
  }

  if (coupon.end_time && new Date(coupon.end_time) < now) {
    return { valid: false, error: 'This coupon code has expired.' };
  }

  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    return { valid: false, error: 'This coupon has reached its usage limit.' };
  }

  if (subtotal < Number(coupon.min_order_amount || 0)) {
    return { 
      valid: false, 
      error: `Minimum order of KSh ${coupon.min_order_amount} required for this code.` 
    };
  }

  // Calculate exact discount
  let discountAmount = 0;
  if (coupon.discount_type === 'percentage') {
    discountAmount = Math.round((subtotal * Number(coupon.discount_value)) / 100);
    if (coupon.max_discount_amount) {
      discountAmount = Math.min(discountAmount, Number(coupon.max_discount_amount));
    }
  } else {
    discountAmount = Number(coupon.discount_value);
  }

  // Ensure discount doesn't exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);

  return {
    valid: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discount_type as 'percentage' | 'fixed',
      discountValue: Number(coupon.discount_value),
      discountAmount,
    }
  };
}