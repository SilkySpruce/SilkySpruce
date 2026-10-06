"use server";

import { supabase } from '@/lib/supabase';

export async function unsubscribeFromNewsletter(formData: FormData) {
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