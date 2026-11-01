import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { globalRatelimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';

// Initialize Supabase with the Service Role Key to safely bypass RLS in backend server code
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? '127.0.0.1';
  
  const { success } = await globalRatelimit.limit(`webhook_${ip}`);
  if (!success) {
    return NextResponse.json({ message: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    // Paystack requires the raw body string to calculate and verify the HMAC SHA512 signature
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json({ message: 'Missing signature' }, { status: 400 });
    }

    // Verify the request genuinely came from Paystack using the Live Secret Key
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle successful card/mobile money charges
    if (event.event === 'charge.success') {
      const paymentReference = event.data.reference;
      const customerEmail = event.data.customer.email;
      
      
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: 'Processing'
        })
        .eq('order_number', paymentReference) 
        .select();

      if (error) {
        console.error('Supabase order status update failed:', error);
      } else {
        console.log('Order successfully updated to Processing for reference:', paymentReference);
      }
    }

    // Always return a 200 OK so Paystack knows the webhook was received successfully
    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('Webhook execution error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}