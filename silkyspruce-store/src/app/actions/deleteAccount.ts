"use server";

import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { strictRatelimit } from '@/lib/ratelimit';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function deleteUserAccount(userId: string) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? '127.0.0.1';
  
  const { success } = await strictRatelimit.limit(`strict_${ip}`);
  if (!success) {
    return { success: false, error: 'Too many requests. Please try again later.' };
  }

  try {
    // Deleting from auth.users automatically cascades to public.profiles 
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Account deletion failed:", error);
    return { success: false, error: error.message || 'Failed to delete account.' };
  }
}