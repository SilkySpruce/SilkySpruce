"use server";

import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import { strictRatelimit } from '@/lib/ratelimit';

export async function subscribeToNewsletter(formData: FormData) {
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

  const { error } = await supabase
    .from('subscribers')
    .insert([{ email }]);

  // Error code 23505 means the email is already in the database (Unique constraint)
  if (error) {
    if (error.code === '23505') { 
      return { success: true, message: 'You are already on the list!' };
    }
    return { success: false, error: 'Failed to subscribe. Please try again.' };
  }

  return { success: true, message: 'Welcome to the tribe! Keep an eye on your inbox.' };
}