"use server";

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CancelOrderParams {
  orderNumber: string;
  userId: string;
  reason: string;
  isAdmin?: boolean;
}

export async function cancelOrder({ orderNumber, userId, reason, isAdmin = false }: CancelOrderParams) {
  try {
    // 1. FETCH ORDER & VERIFY OWNERSHIP
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found.");
    }

    if (!isAdmin && order.user_id !== userId) {
      throw new Error("Unauthorized cancellation attempt.");
    }

    // 2. STATUS GUARDRAIL
    if (order.status !== 'Pending' && order.status !== 'Processing') {
      throw new Error(`This order cannot be cancelled because it is currently ${order.status}.`);
    }

    let penaltyFee = 0;
    let newCancellationCount = 0;
    let newLoyaltyPoints = 0;

    // 3. USER PENALTY & POINTS REVERSAL MATH
    if (order.user_id) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('loyalty_points, cancellation_count')
        .eq('id', order.user_id)
        .single();

      const currentPoints = profile?.loyalty_points || 0;
      const currentCancellations = profile?.cancellation_count || 0;

      // First cancellation is free (count is 0). Subsequent cancellations trigger a fee.
      // Admins cancelling orders do not penalize the user.
      if (!isAdmin && currentCancellations > 0) {
        penaltyFee = 100; // KSh 100 cancellation fee
      }

      newCancellationCount = isAdmin ? currentCancellations : currentCancellations + 1;
      
      // Points Reversal: Refund points used, subtract points earned on this order
      newLoyaltyPoints = currentPoints + (order.points_used || 0) - (order.points_earned || 0);
      
      // Safety check to ensure points never drop below 0
      if (newLoyaltyPoints < 0) newLoyaltyPoints = 0;
    }

    // 4. INVENTORY RESTOCK
    const { data: orderItems } = await supabaseAdmin
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', order.id);

    if (orderItems && orderItems.length > 0) {
      const variantIds = orderItems.map(item => item.product_id);
      
      const { data: variants } = await supabaseAdmin
        .from('product_variants')
        .select('id, stock_quantity')
        .in('id', variantIds);

      if (variants) {
        for (const item of orderItems) {
          const variant = variants.find(v => v.id === item.product_id);
          if (variant) {
            await supabaseAdmin
              .from('product_variants')
              .update({ stock_quantity: variant.stock_quantity + item.quantity })
              .eq('id', variant.id);
          }
        }
      }
    }

    // 5. UPDATE ORDER RECORD
    const { error: updateOrderError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'Cancelled',
        refund_status: 'Pending',
        cancellation_reason: isAdmin ? `Admin: ${reason}` : `User: ${reason}`,
        penalty_fee: penaltyFee
      })
      .eq('id', order.id);

    if (updateOrderError) throw new Error(`Failed to update order: ${updateOrderError.message}`);

    // 6. COMMIT PROFILE UPDATES
    if (order.user_id) {
      await supabaseAdmin
        .from('profiles')
        .update({
          loyalty_points: newLoyaltyPoints,
          cancellation_count: newCancellationCount
        })
        .eq('id', order.user_id);
    }

    return { 
      success: true, 
      penaltyApplied: penaltyFee > 0,
      refundAmount: order.total_amount - penaltyFee,
      message: `Order cancelled. KSh ${order.total_amount - penaltyFee} queued for refund.`
    };

  } catch (error: any) {
    console.error("Cancellation Error:", error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}