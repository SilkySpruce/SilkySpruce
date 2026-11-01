"use server";

import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import { strictRatelimit } from '@/lib/ratelimit';

export async function unsubscribeFromNewsletter(formData: FormData) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? '127.0.0.1';
  
  const { success } = await strictRatelimit.limit(`strict_${ip}`);
  if (!success) {
    return { success: false, error: 'Too many requests. Please try again in a minute.' };
  }

  const email = formData.get('email') as string;
  
  if (!email) {
    return { success: false, error: 'Email is required.' };
  }

  const { error, count } = await supabase
    .from('subscribers')
    .delete({ count: 'exact' })
    .eq('email', email);

  if (error) {
    return { success: false, error: 'Failed to process request. Please try again.' };
  }

  return { success: true, message: 'You have been successfully unsubscribed.' };
}