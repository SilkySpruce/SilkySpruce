"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    const { data, error } = await resend.emails.send({
      // Until you verify a custom domain like silkyspruce.co.ke, 
      // Resend requires you to send FROM this testing address:
      from: 'Silky Spruce <onboarding@resend.dev>',
      to: 'fountaincreations@gmail.com',
      replyTo: email, // This allows you to click "Reply" in Gmail and email the customer directly
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