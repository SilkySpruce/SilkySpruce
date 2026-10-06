// src/app/actions/sendOrderEmail.ts
"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Define the types expected from your checkout form/cart
interface OrderData {
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shipping: number;
}

export async function sendOrderEmails(orderData: OrderData) {
  const { orderId, customer, items, total, shipping } = orderData;

  // Build the item list HTML
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.size}) x${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">KSh ${item.price * item.quantity}</td>
    </tr>
  `).join('');

  try {
    // 1. Send Email to Admin (Store Owner)
    const adminEmailPromise = resend.emails.send({
      from: 'Silky Spruce Orders <onboarding@resend.dev>',
      to: 'fountaincreations@gmail.com',
      subject: `🚨 New Order Received! #${orderId}`,
      html: `
        <h2>New Order: #${orderId}</h2>
        <h3>Customer Details:</h3>
        <p>
          <strong>Name:</strong> ${customer.firstName} ${customer.lastName}<br/>
          <strong>Email:</strong> ${customer.email}<br/>
          <strong>Phone:</strong> ${customer.phone}<br/>
          <strong>Delivery Address:</strong> ${customer.address}
        </p>
        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 10px; font-weight: bold;">Shipping</td>
            <td style="padding: 10px; text-align: right;">KSh ${shipping}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Total</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">KSh ${total}</td>
          </tr>
        </table>
      `,
    });

    // 2. Send Email to Customer
    // NOTE: 'to' is hardcoded to your email for testing. 
    // Change 'to: fountaincreations@gmail.com' to 'to: customer.email' once your domain is verified on Resend.
    const customerEmailPromise = resend.emails.send({
      from: 'Silky Spruce <onboarding@resend.dev>',
      to: 'fountaincreations@gmail.com', 
      subject: `Order Confirmation #${orderId} - Silky Spruce`,
      html: `
        <div style="font-family: sans-serif; color: #111;">
          <h2>Thank you for your order, ${customer.firstName}!</h2>
          <p>We've received your order and are getting it ready for you. Here is your receipt:</p>
          
          <div style="background-color: #f9fafb; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
              <tr>
                <td style="padding: 10px; font-weight: bold;">Shipping</td>
                <td style="padding: 10px; text-align: right;">KSh ${shipping}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; font-size: 1.1em;">Total</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.1em;">KSh ${total}</td>
              </tr>
            </table>
          </div>

          <h3>Delivery Details</h3>
          <p>${customer.address}<br/>${customer.phone}</p>
          
          <p>If you have any questions, simply reply to this email!</p>
          <p>Warmly,<br/>The Silky Spruce Team</p>
        </div>
      `,
    });

    // Execute both emails concurrently
    await Promise.all([adminEmailPromise, customerEmailPromise]);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send order emails' };
  }
}