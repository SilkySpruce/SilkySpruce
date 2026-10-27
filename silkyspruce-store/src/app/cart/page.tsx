"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { Trash2, Plus, Minus, CreditCard, Smartphone, ShieldCheck, Gift, MapPin } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { processCheckout } from '../actions/processCheckout';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import { calculateShippingFee } from '@/utils/shipping';

const PaystackButton = dynamic(() => import('@/components/PaystackButton'), { ssr: false });

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [usePoints, setUsePoints] = useState(false);
  
  // Address & Geocoding State
  const [savedAddress, setSavedAddress] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [shippingFee, setShippingFee] = useState(300); // Default fallback fee
  const autoCompleteRef = useRef<HTMLInputElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    country: "Kenya",
    city: "",
    street: "",
    apartment: "",
    lat: null as number | null,
    lng: null as number | null
  });

  const { user } = useUserStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);

    const fetchSavedAddress = async () => {
      if (user?.id) {
        setIsFetchingAddress(true);
        const { data, error } = await supabase
          .from('user_addresses') 
          .select('*')
          .eq('user_id', user.id)
          .eq('is_default', true) 
          .maybeSingle();
          
        if (!error && data) {
          setShippingDetails({
            country: data.country || "Kenya",
            city: data.city || "",
            street: data.street_address || data.address_line_1 || "", 
            apartment: data.apartment || "",
            lat: data.latitude || null,
            lng: data.longitude || null
          });
          setSavedAddress(`${data.street_address || data.address_line_1}, ${data.city}`);
          setUseNewAddress(false);

          if (data.latitude && data.longitude) {
            setShippingFee(calculateShippingFee(data.latitude, data.longitude));
          }
        }
        setIsFetchingAddress(false);
      }
    };

    fetchSavedAddress();
  }, [user]);

  // Safely Initialize Google Maps Autocomplete only when the input field and Google object are ready
    useEffect(() => {
    // Defensive check to prevent crashes if Google Maps fails to load due to missing/invalid API keys
    const googleMaps = (window as any).google?.maps;
    if (!isGoogleLoaded || !useNewAddress || !autoCompleteRef.current || !googleMaps?.places) {
      return;
    }

    const autocomplete = new googleMaps.places.Autocomplete(autoCompleteRef.current, {
      componentRestrictions: { country: ["ke", "ug", "tz"] },
      fields: ["formatted_address", "geometry", "name"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address || place.name;

        const cleanAddress = formattedAddress.replace(', Kenya', '').replace(', Uganda', '');

        setShippingDetails(prev => ({
          ...prev,
          street: cleanAddress,
          lat: lat,
          lng: lng
        }));

        setShippingFee(calculateShippingFee(lat, lng));
      }
    });

    return () => {
      if (googleMaps) {
        googleMaps.event.removeListener(listener);
      }
    };
  }, [isGoogleLoaded, useNewAddress]);  

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const maxPoints = Math.min(user?.loyaltyPoints || 0, subtotal);
  const pointsApplied = usePoints ? maxPoints : 0;
  const total = subtotal - pointsApplied + (items.length > 0 ? shippingFee : 0);

  const getFinalAddress = () => {
    if (!useNewAddress && savedAddress) return savedAddress;
    return `${shippingDetails.street}${shippingDetails.apartment ? `, ${shippingDetails.apartment}` : ''}, ${shippingDetails.city}, ${shippingDetails.country}`;
  };

  const config = {
    reference: `ORD-${new Date().getTime()}`,
    email: user?.email || "guest@silkyspruce.co.ke",
    amount: total * 100, 
    currency: 'KES',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  };

  const validateCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return false;
    }
    if (useNewAddress && (!shippingDetails.lat || !shippingDetails.lng)) {
      alert("Please select a valid address from the dropdown suggestions so we can calculate delivery.");
      return false;
    }
    return true;
  };

  const executeCheckout = async (isSandbox = false) => {
    if (!validateCheckout()) return;

    if (isSandbox) {
      const confirmed = window.confirm("SANDBOX MODE: Click OK to simulate a successful payment.");
      if (!confirmed) return;
    }

    const finalAddress = getFinalAddress();
    const checkoutPayload = {
      userId: user?.id,
      pointsUsed: pointsApplied, 
      customer: {
        firstName: user?.firstName || "Guest",
        lastName: user?.lastName || "User",
        email: user?.email || "guest@silkyspruce.co.ke",
        phone: user?.phone || "+254700000000",
        address: finalAddress,
        latitude: shippingDetails.lat,
        longitude: shippingDetails.lng,
        city: shippingDetails.city
      },
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        size: item.size || 'Standard',
        quantity: item.quantity,
        price: item.price
      }))
    };
    
    alert(isSandbox ? "Processing sandbox order..." : "Payment successful. Saving your order.");
    const result = await processCheckout(checkoutPayload);

    if (result.success) {
      alert(`Order ${result.orderNumber} placed! You earned ${result.pointsEarned || 0} loyalty points.`);
      
      if (user) {
        useUserStore.setState({ 
          user: { ...user, loyaltyPoints: (user.loyaltyPoints || 0) - pointsApplied + (result.pointsEarned || 0) } 
        });
      }

      clearCart();
      router.push('/account');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (!isMounted) return <div className="loading-state">Loading your cart...</div>;

  if (items.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Your cart is empty.</h2>
        <p>Explore our plant based collection to start building your routine.</p>
        <Link href="/shop" className="continue-shopping-btn">Explore the Collection</Link>
        <CartStyles />
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Script loaded with correct async attribute and onReady handler */}
      <Script 
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&loading=async`} 
        strategy="afterInteractive" 
        onReady={() => setIsGoogleLoaded(true)}
      />

      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-layout">
        
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
                    
                    <div className="qty-controls mobile-qty">
                      <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>

                <div className="qty-controls hidden-mobile">
                  <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                </div>

                <div className="item-total hidden-mobile">
                  <p>KSh {item.price * item.quantity}</p>
                </div>

                <button className="remove-btn" onClick={() => removeItem(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="payment-security-block">
            <h3><ShieldCheck size={18} className="shield-icon" /> Secure Checkout</h3>
            <p>We accept local and international payment methods.</p>
            <div className="payment-methods">
              <div className="payment-badge"><Smartphone size={24} /><span>M Pesa or Airtel</span></div>
              <div className="payment-badge"><CreditCard size={24} /><span>Visa or Mastercard</span></div>
            </div>
          </div>
        </div>

        <aside className="cart-sidebar">
          <div className="summary-card">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>KSh {subtotal}</span>
            </div>

            {user && (user.loyaltyPoints || 0) > 0 && (
              <div className="summary-row loyalty-summary-row">
                <label className="loyalty-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={usePoints} 
                    onChange={(e) => setUsePoints(e.target.checked)} 
                    className="loyalty-checkbox-input"
                  />
                  <Gift size={16} /> Use Points ({user.loyaltyPoints})
                </label>
                {usePoints && <span className="loyalty-discount-text">Subtract KSh {pointsApplied}</span>}
              </div>
            )}
            
            <div className="summary-row delivery-summary-row">
              <span>Delivery</span>
              <span>{shippingFee === 0 ? 'Free' : `KSh ${shippingFee}`}</span>
            </div>

            <div className="shipping-section">
              <h3 className="shipping-section-title">Shipping Address</h3>

              {isFetchingAddress ? (
                <p className="loading-address-text">Loading saved address...</p>
              ) : (
                <div className="shipping-address-container">
                  
                  {savedAddress && (
                    <label className="shipping-radio-label">
                      <input 
                        type="radio" 
                        name="address_choice" 
                        checked={!useNewAddress}
                        onChange={() => {
                          setUseNewAddress(false);
                          if (shippingDetails.lat && shippingDetails.lng) {
                            setShippingFee(calculateShippingFee(shippingDetails.lat, shippingDetails.lng));
                          }
                        }}
                        className="shipping-radio-input"
                      />
                      <div>
                        <span className="shipping-radio-text-main">Use Saved Address</span>
                        <span className="shipping-radio-text-sub">{savedAddress}</span>
                      </div>
                    </label>
                  )}

                  {savedAddress && (
                    <label className="shipping-radio-label-center">
                      <input 
                        type="radio" 
                        name="address_choice" 
                        checked={useNewAddress}
                        onChange={() => setUseNewAddress(true)}
                        className="shipping-radio-input-center"
                      />
                      <span className="shipping-radio-text-main">Ship to a different address</span>
                    </label>
                  )}

                  {useNewAddress && (
                    <div className={`shipping-form-container ${savedAddress ? 'shipping-form-container-mt' : ''}`}>
                      <div className="shipping-form-row">
                        <div className="shipping-form-group">
                          <label className="shipping-label">Country</label>
                          <select 
                            value={shippingDetails.country} 
                            onChange={(e) => setShippingDetails({...shippingDetails, country: e.target.value})} 
                            className="shipping-input shipping-input-bg"
                          >
                            <option value="Kenya">Kenya</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Tanzania">Tanzania</option>
                          </select>
                        </div>
                        <div className="shipping-form-group">
                          <label className="shipping-label">City</label>
                          <select 
                            value={shippingDetails.city} 
                            onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})} 
                            className="shipping-input shipping-input-bg"
                          >
                            <option value="" disabled>Select City...</option>
                            <option value="Nairobi">Nairobi</option>
                            <option value="Mombasa">Mombasa</option>
                            <option value="Kisumu">Kisumu</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* GOOGLE MAPS AUTOCOMPLETE */}
                      <div className="search-container">
                        <label className="shipping-label">Search Location / Street Address</label>
                        <div className="search-input-wrapper">
                          <MapPin size={18} className="search-icon" />
                          <input 
                            ref={autoCompleteRef}
                            type="text" 
                            defaultValue={shippingDetails.street}
                            placeholder="Start typing to search..."
                            className="shipping-input shipping-input-search"
                          />
                        </div>
                        <span className="search-helper-text">Select an address from the dropdown to calculate delivery.</span>
                      </div>

                      <div className="shipping-form-group">
                        <label className="shipping-label">Apartment (Optional)</label>
                        <input 
                          type="text" 
                          value={shippingDetails.apartment}
                          onChange={(e) => setShippingDetails({...shippingDetails, apartment: e.target.value})}
                          placeholder="e.g. Apt 4B"
                          className="shipping-input"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>KSh {total}</span>
            </div>

            {process.env.NEXT_PUBLIC_SIMULATE_PAYMENTS === 'true' ? (
              <button className="checkout-btn" onClick={() => executeCheckout(true)}>
                PROCEED TO CHECKOUT (SANDBOX)
              </button>
            ) : (
              <PaystackButton 
                config={config} onSuccess={() => executeCheckout(false)} onClose={() => alert("Payment cancelled.")} 
                onValidation={validateCheckout} className="checkout-btn" text="PROCEED TO CHECKOUT"
              />
            )}
            
            <p className="checkout-terms">Taxes calculated at checkout.</p>
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
      display: flex;
      justify-content: space-between;
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
      .mobile-qty {
        display: none !important;
      }
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
    .loading-address-text {
      color: #9ca3af;
      font-size: 0.875rem;
    }
    .shipping-section-title {
      font-size: 1rem;
      color: #ffffff;
      margin-bottom: 1rem;
    }
    .shipping-address-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .shipping-radio-label {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
    }
    .shipping-radio-label-center {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }
    .shipping-radio-input {
      margin-top: 0.25rem;
      accent-color: #788E7D;
    }
    .shipping-radio-input-center {
      accent-color: #788E7D;
    }
    .shipping-radio-text-main {
      display: block;
      color: #ffffff;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .shipping-radio-text-sub {
      display: block;
      color: #9ca3af;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .shipping-form-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .shipping-form-container-mt {
      margin-top: 0.5rem;
    }
    .shipping-form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .shipping-form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .shipping-label {
      font-size: 0.75rem;
      color: #9ca3af;
      text-transform: uppercase;
    }
    .shipping-input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem;
      background: transparent;
      border: 1px solid #2A2A2A;
      color: white;
      outline: none;
    }
    .shipping-input-bg {
      background: #1A1A1A;
    }
    .shipping-input-search {
      padding-left: 2.5rem;
      background: transparent;
    }
    .search-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
    }
    .search-input-wrapper {
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
    }
    .search-helper-text {
      font-size: 0.625rem;
      color: #788E7D;
      margin-top: 0.25rem;
    }
    .loyalty-checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      color: #788E7D;
      font-weight: 500;
    }
    .loyalty-checkbox-input {
      accent-color: #788E7D;
      width: 1.125rem;
      height: 1.125rem;
      cursor: pointer;
    }
    .loyalty-discount-text {
      color: #788E7D;
      font-weight: 600;
    }
    .loyalty-summary-row {
      align-items: center;
      border-bottom: 1px solid #2A2A2A;
      padding-bottom: 1rem;
    }
    .delivery-summary-row {
      margin-top: 1rem;
    }
    .shipping-section {
      margin-bottom: 1.5rem;
      border-top: 1px solid #2A2A2A;
      padding-top: 1.5rem;
    }
    .pac-container {
      background-color: #1A1A1A !important;
      border: 1px solid #2A2A2A !important;
      color: white !important;
      font-family: inherit !important;
    }
    .pac-item {
      color: #9ca3af !important;
      border-top: 1px solid #2A2A2A !important;
      padding: 10px !important;
    }
    .pac-item:hover {
      background-color: #2A2A2A !important;
    }
    .pac-item-query {
      color: white !important;
    }
  `}</style>
);