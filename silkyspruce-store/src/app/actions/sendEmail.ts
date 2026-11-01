"use server";

import { Resend } from 'resend';
import { headers } from 'next/headers';
import { strictRatelimit } from '@/lib/ratelimit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? '127.0.0.1';
  
  const { success } = await strictRatelimit.limit(`strict_${ip}`);
  if (!success) {
    return { success: false, error: 'Too many requests. Please try again in a minute.' };
  }

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Silky Spruce <hello@silkyspruce.com>',
      to: 'fountaincreations@gmail.com',
      replyTo: email, 
      subject: `New Message from ${firstName} ${lastName}`,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Failed to send email' };
  }
}