"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const REFERRAL_BONUS_POINTS = 100;

export async function processReferralReward({
  referralCode,
  buyerEmail,
  orderReference,
}: {
  referralCode: string | null;
  buyerEmail: string;
  orderReference: string;
}) {
  if (!referralCode || !buyerEmail) return { rewarded: false };

  const normalizedEmail = buyerEmail.trim().toLowerCase();
  const normalizedCode = referralCode.trim().toUpperCase();

  // 1. Find the referrer by code
  const { data: referrer } = await supabaseAdmin
    .from("profiles")
    .select("id, email, loyalty_points")
    .eq("referral_code", normalizedCode)
    .single();

  // Prevent self-referrals or invalid codes
  if (!referrer || referrer.email?.toLowerCase() === normalizedEmail) {
    return { rewarded: false };
  }

  // 2. Ensure this buyer hasn't already claimed a referral
  const { data: existingClaim } = await supabaseAdmin
    .from("referrals")
    .select("id")
    .eq("referred_email", normalizedEmail)
    .maybeSingle();

  if (existingClaim) {
    return { rewarded: false };
  }

  // 3. Record the referral
  const { error: insertError } = await supabaseAdmin.from("referrals").insert({
    referrer_id: referrer.id,
    referred_email: normalizedEmail,
    order_reference: orderReference,
    points_awarded: REFERRAL_BONUS_POINTS,
  });

  if (insertError) return { rewarded: false };

  // 4. Credit 100 loyalty_points to the referrer
  await supabaseAdmin
    .from("profiles")
    .update({
      loyalty_points: (referrer.loyalty_points || 0) + REFERRAL_BONUS_POINTS,
    })
    .eq("id", referrer.id);

  // 5. Credit 100 loyalty_points to the buyer
  const { data: buyerProfile } = await supabaseAdmin
    .from("profiles")
    .select("id, loyalty_points")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (buyerProfile) {
    await supabaseAdmin
      .from("profiles")
      .update({
        loyalty_points:
          (buyerProfile.loyalty_points || 0) + REFERRAL_BONUS_POINTS,
        referred_by: normalizedCode,
      })
      .eq("id", buyerProfile.id);
  }

  return { rewarded: true, points: REFERRAL_BONUS_POINTS };
}