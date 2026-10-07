"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, CreditCard, Smartphone, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { processCheckout } from '../actions/processCheckout';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [usePoints, setUsePoints] = useState(false);
  const { user } = useUserStore();
  const router = useRouter();

  // Hydration fix for Zustand + Next.js
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

const handleCheckout = async () => {
    if (items.length === 0) return alert("Your cart is empty!");

    const isSimulating = process.env.NEXT_PUBLIC_SIMULATE_PAYMENTS === 'true';

    if (isSimulating) {
      const isSuccess = window.confirm(
        "SANDBOX MODE: Click 'OK' to simulate a SUCCESSFUL payment."
      );
      
      if (isSuccess) {
        // 1. Calculate max points they are allowed to use (can't exceed subtotal)
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const maxPoints = Math.min(user?.loyaltyPoints || 0, subtotal);
        const pointsApplied = usePoints ? maxPoints : 0;

        // 2. Package all the data to send to the backend
        const checkoutPayload = {
          userId: user?.id,
          pointsUsed: pointsApplied, 
          customer: {
            firstName: user?.firstName || "Guest",
            lastName: user?.lastName || "User",
            email: user?.email || "fountaincreations@gmail.com",
            phone: user?.phone || "+254700000000",
            address: "123 Test Ave, Nairobi, Kenya"
          },
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            size: item.size || 'Standard',
            quantity: item.quantity,
            price: item.price
          }))
        };

        alert("Payment successful! Processing order...");
        
        // 3. Send the payload to our secure Server Action
        const result = await processCheckout(checkoutPayload);

        if (result.success) {
          alert(`Order ${result.orderNumber} placed! You earned ${result.pointsEarned} loyalty points.`);
          clearCart();
          router.push('/account')
        } else {
          alert(`Error: ${result.error}`);
        }
      }
    } else {
      alert("Initiating secure payment gateway connection...");
    }
  };

  if (!isMounted) return <div className="loading-state">Loading ritual...</div>;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + (items.length > 0 ? shipping : 0);

  if (items.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Your ritual is empty.</h2>
        <p>Discover our plant-based collection to start building your routine.</p>
        <Link href="/shop" className="continue-shopping-btn">Explore the Collection</Link>
        <CartStyles />
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      <div className="cart-layout">
        
        {/* LEFT COLUMN: ITEMS & SECURE CHECKOUT BADGES */}
        <div className="cart-main">
          
          <div className="cart-items-header">
            <span>Product</span>
            <span className="hidden-mobile">Quantity</span>
            <span className="hidden-mobile">Total</span>
          </div>

          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <Link href={`/shop/${item.slug}`} className="item-image-wrapper">
                    <Image src={item.image} alt={item.name} fill className="item-image" />
                  </Link>
                  <div className="item-details">
                    <Link href={`/shop/${item.slug}`} className="item-name">{item.name}</Link>
                    <p className="item-size">Size: {item.size === 'Default Title' ? 'Standard' : item.size}</p>
                    <p className="item-price-mobile">KSh {item.price}</p>
                    
                    {/* Mobile Quantity Control */}
                    <div className="qty-controls mobile-qty">
                      <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>

                {/* Desktop Quantity Control */}
                <div className="qty-controls hidden-mobile">
                  <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                </div>

                <div className="item-total hidden-mobile">
                  <p>KSh {item.price * item.quantity}</p>
                </div>

                <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove item">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Secure Payment Badges */}
          <div className="payment-security-block">
            <h3><ShieldCheck size={18} className="shield-icon" /> Secure Checkout</h3>
            <p>We accept local and international payment methods.</p>
            <div className="payment-methods">
              <div className="payment-badge">
                <Smartphone size={24} />
                <span>M-Pesa / Airtel</span>
              </div>
              <div className="payment-badge">
                <CreditCard size={24} />
                <span>Visa / Mastercard</span>
              </div>
              <div className="payment-badge">
                <span className="paypal-text">PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <aside className="cart-sidebar">
          <div className="summary-card">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>KSh {subtotal}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery</span>
              <span>{shipping === 0 ? 'Free' : `KSh ${shipping}`}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>KSh {total}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              PROCEED TO CHECKOUT
            </button>
            
            <p className="checkout-terms">
              Taxes and international shipping calculated at checkout.
            </p>
          </div>
        </aside>

      </div>
      <CartStyles />
    </div>
  );
}

const CartStyles = () => (
  <style>{`
    .cart-container { 
        width: 100%; 
        max-width: 80rem; 
        margin: 0 auto; 
        padding: 4rem 2rem 8rem; 
        display: flex; 
        flex-direction: column; 
    }
    .cart-title { 
        font-size: 3rem; 
        font-weight: 700; 
        color: #ffffff; 
        margin-bottom: 3rem; 
        border-bottom: 1px solid #2A2A2A; 
        padding-bottom: 2rem; 
    }
    .loading-state { 
        height: 60vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: #9ca3af;
    }
    
    .empty-cart-container { 
        width: 100%; 
        min-height: 60vh; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        text-align: center; 
        padding: 2rem; 
    }
    .empty-cart-container h2 { 
        font-size: 2.5rem; 
        font-weight: 700; 
        color: #ffffff; 
        margin-bottom: 1rem; 
    }
    .empty-cart-container p { 
        color: #9ca3af; 
        margin-bottom: 2.5rem; 
        font-size: 1.125rem; 
    }
    .continue-shopping-btn { 
        background: #788E7D; 
        color: #ffffff; 
        text-decoration: none; 
        padding: 1rem 2.5rem; 
        font-weight: 600; 
        letter-spacing: 0.05em; 
        transition: background 0.2s; 
    }
    .continue-shopping-btn:hover { 
        background: #687C6D; 
    }

    .cart-layout { 
        display: flex; 
        flex-direction: column; 
        gap: 4rem; 
    }
    @media (min-width: 1024px) { 
        .cart-layout { 
            flex-direction: row; 
            align-items: flex-start; 
        } 
    }
    .cart-main { 
        flex-grow: 1; 
        width: 100%; 
    }
    .cart-items-header { 
        display: flex; justify-content: 
        space-between; 
        border-bottom: 1px solid #2A2A2A; 
        padding-bottom: 1rem; 
        margin-bottom: 2rem; 
        font-size: 0.75rem; 
        text-transform: uppercase; 
        letter-spacing: 0.1em; 
        color: #6b7280; 
        font-weight: 600; 
    }
    @media (min-width: 768px) { 
        .cart-items-header { 
            display: grid; 
            grid-template-columns: 3fr 1fr 1fr 2rem; 
        } 
    }

    .hidden-mobile { 
        display: none !important; 
    }
    @media (min-width: 768px) { 
        .hidden-mobile { 
            display: flex !important; 
        } 
        .mobile-qty { display: none !important; } 
    }

    .cart-item { 
        display: flex; 
        align-items: flex-start; 
        justify-content: space-between; 
        padding-bottom: 2rem; 
        margin-bottom: 2rem; 
        border-bottom: 1px solid #2A2A2A; 
    }
    @media (min-width: 768px) { 
        .cart-item { 
            display: grid; 
            grid-template-columns: 3fr 1fr 1fr 2rem; 
            align-items: center; 
        } 
    }

    .item-info { 
        display: flex; 
        gap: 1.5rem; 
        width: 100%; 
    }
    .item-image-wrapper { 
        position: relative; 
        width: 6rem; 
        height: 7.5rem; 
        background: #1A1A1A; 
        flex-shrink: 0; 
    }
    .item-image { 
        object-fit: cover; 
    }
    .item-details { 
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
    }
    .item-name { 
        font-size: 1.125rem; 
        font-weight: 600; 
        color: #ffffff; 
        text-decoration: none; 
        margin-bottom: 0.25rem; 
        transition: color 0.2s; 
    }
    .item-name:hover { 
        color: #788E7D; 
    }
    .item-size { 
        color: #9ca3af; 
        font-size: 0.875rem; 
        margin-bottom: 0.5rem; 
    }
    .item-price-mobile { 
        color: #ffffff; 
        font-weight: 600; 
        margin-bottom: 1rem; 
    }
    @media (min-width: 768px) { 
        .item-price-mobile { 
            display: none; 
        } 
    }
    .qty-controls { 
        display: flex; 
        align-items: center; 
        border: 1px solid #2A2A2A; 
        width: fit-content; 
    }
    .qty-controls button { 
        background: transparent; 
        border: none; 
        color: #ffffff; 
        padding: 0.5rem 0.75rem; 
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        transition: background 0.2s; 
    }
    .qty-controls button:hover { 
        background: #2A2A2A; 
    }
    .qty-controls span { 
        width: 2rem; 
        text-align: center; 
        font-size: 0.875rem; 
        font-weight: 600; 
    }
    .item-total { 
        font-weight: 600; 
        color: #ffffff; 
    }
    .remove-btn { 
        background: transparent; 
        border: none; 
        color: #9ca3af; 
        cursor: pointer; 
        transition: color 0.2s; 
        padding: 0.5rem; 
    }
    .remove-btn:hover { 
        color: #ef4444; 
    }

    /* Payment Badges */
    .payment-security-block { 
        margin-top: 4rem; 
        padding: 2rem; 
        border: 1px solid #2A2A2A; 
        background: transparent; 
    }
    .payment-security-block h3 { 
        display: flex; 
        align-items: center; 
        gap: 0.5rem; 
        color: #ffffff; 
        font-size: 1.125rem; 
        font-weight: 600; 
        margin-bottom: 0.5rem; 
    }
    .shield-icon { 
        color: #788E7D; 
    }
    .payment-security-block p { 
        color: #9ca3af; 
        font-size: 0.875rem; 
        margin-bottom: 1.5rem; 
    }
    .payment-methods { 
        display: flex; 
        flex-wrap: wrap; 
        gap: 1rem; 
    }
    .payment-badge { 
        display: flex; 
        align-items: center; 
        gap: 0.5rem; 
        border: 1px solid #2A2A2A; 
        padding: 0.75rem 1rem; 
        color: #d1d5db; 
        background: rgba(255,255,255,0.02); 
    }
    .paypal-text { 
        font-weight: 700; 
        font-style: italic; 
        font-size: 1.125rem; 
    }

    /* Sidebar Summary */
    .cart-sidebar {
        width: 100%; 
        position: sticky; 
        top: 6rem; 
    }
    @media (min-width: 1024px) { 
        .cart-sidebar { 
            width: 24rem; 
            flex-shrink: 0; 
        } 
    }

    .summary-card { 
        border: 1px solid #2A2A2A; 
        padding: 2rem; 
        background: transparent; 
    }
    .summary-title { 
        font-size: 1.5rem; 
        font-weight: 600; 
        color: #ffffff; 
        margin-bottom: 2rem; 
        padding-bottom: 1rem; 
        border-bottom: 1px solid #2A2A2A; 
    }
    .summary-row { 
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 1rem; 
        color: #d1d5db; 
        font-size: 1rem; 
    }
    .summary-total { 
        display: flex; 
        justify-content: space-between; 
        margin: 2rem 0; 
        padding-top: 1.5rem; 
        border-top: 1px solid #2A2A2A; 
        font-size: 1.25rem; 
        font-weight: 600; 
        color: #ffffff; 
    }

    .checkout-btn { 
        width: 100%; 
        background: #788E7D; 
        color: #ffffff; 
        border: none; 
        padding: 1.25rem; 
        font-size: 1rem; 
        font-weight: 600; 
        letter-spacing: 0.05em; 
        cursor: pointer; 
        transition: background 0.2s; 
        margin-bottom: 1rem; 
    }
    .checkout-btn:hover { 
        background: #687C6D; 
    }
    .checkout-terms { 
        font-size: 0.75rem; 
        color: #6b7280; 
        text-align: center; 
    }
  `}</style>
);