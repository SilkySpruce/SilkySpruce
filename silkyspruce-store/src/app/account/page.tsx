"use client";

import { useState, useEffect } from 'react';
import { Package, MapPin, Star, Heart, User, LogOut, Plus, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

interface Address {
  id: string;
  recipientName: string;
  phone: string;
  streetAddress: string;
  apartment: string;
  city: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { user, isAuthenticated, loginUser, logoutUser } = useUserStore();
  const { clearCart } = useCartStore();
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Profile Form State
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);

  // Address Book State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    phone: '',
    streetAddress: '',
    apartment: '',
    city: '',
    isDefault: false
  });

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    setAuthMessage('');

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: ''
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user?.identities?.length === 0) {
          setAuthError('This email is already registered. Please sign in.');
        } else {
          setAuthMessage('Account created successfully!');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Profile Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      data: { phone: phone }
    });
    
    if (error) {
      alert("Failed to update profile: " + error.message);
    } else {
      alert("Profile updated successfully!");
    }
  };

  // Fetch user's order history
  const loadOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    } else if (error) {
      console.error("Error loading orders:", error);
    }
  };

  // Address Handlers
  const loadAddresses = async (userId: string) => {
    const { data } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      setAddresses(data.map(d => ({
        id: d.id,
        recipientName: d.recipient_name,
        phone: d.phone,
        streetAddress: d.street_address,
        apartment: d.apartment || '',
        city: d.city,
        isDefault: d.is_default
      })));
    }
  };

useEffect(() => {
    setIsMounted(true);
    
    const fetchAndSetUserData = async (sessionUser: any) => {
      // Grab their real point balance from the new profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('loyalty_points')
        .eq('id', sessionUser.id)
        .single();

      loginUser({
        id: sessionUser.id,
        email: sessionUser.email || '',
        firstName: sessionUser.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: sessionUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        loyaltyPoints: profile?.loyalty_points || 0, 
        phone: sessionUser.user_metadata?.phone || '',
      });
      setPhone(sessionUser.user_metadata?.phone || '');
      loadAddresses(sessionUser.id);
      loadOrders(sessionUser.id);
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchAndSetUserData(session.user);
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchAndSetUserData(session.user);
      } else if (event === 'SIGNED_OUT') {
        logoutUser();
        setAddresses([]);
        setOrders([]);
        clearCart();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loginUser, logoutUser]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // If setting as default, remove default status from all other addresses first
    if (newAddress.isDefault) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { error } = await supabase.from('user_addresses').insert([{
      user_id: user.id,
      recipient_name: newAddress.recipientName,
      phone: newAddress.phone,
      street_address: newAddress.streetAddress,
      apartment: newAddress.apartment,
      city: newAddress.city,
      is_default: newAddress.isDefault
    }]);

    if (!error) {
      loadAddresses(user.id);
      setShowAddressForm(false);
      setNewAddress({ recipientName: '', phone: '', streetAddress: '', apartment: '', city: '', isDefault: false });
    } else {
      alert("Error saving address: " + error.message);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from('user_addresses').delete().eq('id', id);
    if (!error) {
      loadAddresses(user.id);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    
    // First, set all user addresses to false
    await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
    
    // Then, set the selected one to true
    const { error } = await supabase.from('user_addresses').update({ is_default: true }).eq('id', id);
    
    if (!error) {
      loadAddresses(user.id);
    }
  };

  if (!isMounted) return <div className="loading-state">Loading...</div>;

  // -------------------------
  // VIEW 1: AUTHENTICATION
  // -------------------------
  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">My Account</h1>
          <p className="auth-subtitle">
            {authMode === 'login' ? 'Sign in to access your rituals.' : 'Create an account to join the community.'}
          </p>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authError && <div className="text-red-500 text-sm mb-2 font-semibold">{authError}</div>}
            {authMessage && <div className="text-[#788E7D] text-sm mb-2 font-semibold">{authMessage}</div>}
            
            {authMode === 'signup' && (
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Jane Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD ROW */}
            {authMode === 'login' && (
              <div className="auth-helpers">
                <label className="remember-me">
                  <input type="checkbox" defaultChecked />
                  <span> Remember me</span>
                </label>
              </div>
            )}
            
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'PROCESSING...' : (authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')}
            </button>
          </form>

          <div className="auth-toggle">
            {authMode === 'login' ? (
              <p>Don't have an account? <button onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthMessage(''); }}>Sign up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError(''); setAuthMessage(''); }}>Sign in</button></p>
            )}
          </div>
        </div>
        <AuthStyles />
      </div>
    );
  }

  // -------------------------
  // VIEW 2: ACCOUNT DASHBOARD
  // -------------------------
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {user?.firstName || 'Friend'}</h1>
      </div>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <User size={18} /> <span>Profile Info</span>
            </button>
            <button className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
              <MapPin size={18} /> <span>Address Book</span>
            </button>
            <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <Package size={18} /> <span>Order History</span>
            </button>
            <button className={`nav-item ${activeTab === 'loyalty' ? 'active' : ''}`} onClick={() => setActiveTab('loyalty')}>
              <Star size={18} /> <span>Loyalty Points</span>
            </button>
            <button className="nav-item logout-btn" onClick={handleLogout}>
              <LogOut size={18} /> <span>Log Out</span>
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <section className="tab-section">
              <h2 className="tab-title">Profile Information</h2>
              <form className="profile-form" onSubmit={handleUpdateProfile}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" defaultValue={user?.firstName} disabled className="disabled-input" />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" defaultValue={user?.lastName} disabled className="disabled-input" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue={user?.email} disabled className="disabled-input" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+254 700 000 000" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="save-btn">SAVE CHANGES</button>
              </form>
            </section>
          )}

          {/* ADDRESS BOOK TAB */}
          {activeTab === 'addresses' && (
            <section className="tab-section">
              <div className="tab-header-flex">
                <h2 className="tab-title mb-0">Address Book</h2>
                {!showAddressForm && (
                  <button className="add-new-btn" onClick={() => setShowAddressForm(true)}>
                    <Plus size={16} /> ADD NEW
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <div className="address-form-wrapper">
                  <h3 className="form-subtitle">Add New Address</h3>
                  <form className="profile-form" onSubmit={handleSaveAddress}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Recipient Name</label>
                        <input 
                          type="text" 
                          required 
                          value={newAddress.recipientName}
                          onChange={e => setNewAddress({...newAddress, recipientName: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input 
                          type="tel" 
                          required 
                          value={newAddress.phone}
                          onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Street Address</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. 123 Westlands Road"
                        value={newAddress.streetAddress}
                        onChange={e => setNewAddress({...newAddress, streetAddress: e.target.value})}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Apartment / Suite (Optional)</label>
                        <input 
                          type="text" 
                          value={newAddress.apartment}
                          onChange={e => setNewAddress({...newAddress, apartment: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>City</label>
                        <input 
                          type="text" 
                          required 
                          value={newAddress.city}
                          onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="checkbox-group">
                      <input 
                        type="checkbox" 
                        id="isDefault" 
                        checked={newAddress.isDefault}
                        onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                      />
                      <label htmlFor="isDefault">Set as default delivery address</label>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="save-btn">SAVE ADDRESS</button>
                      <button type="button" className="cancel-btn" onClick={() => setShowAddressForm(false)}>CANCEL</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="address-list">
                  {addresses.length === 0 ? (
                    <p className="empty-state-text">You haven't saved any addresses yet.</p>
                  ) : (
                    addresses.map(address => (
                      <div key={address.id} className="address-card">
                        <div className="address-header">
                          <h3 className="address-name">{address.recipientName}</h3>
                          {address.isDefault && <span className="default-badge">DEFAULT</span>}
                        </div>
                        <p className="address-line">{address.streetAddress}</p>
                        {address.apartment && <p className="address-line">{address.apartment}</p>}
                        <p className="address-line">{address.city}</p>
                        <p className="address-phone">{address.phone}</p>
                        
                        <div className="address-actions">
                          {!address.isDefault && (
                            <button className="action-link" onClick={() => handleSetDefault(address.id)}>Set as Default</button>
                          )}
                          <div className="action-icons">
                            <button className="icon-btn delete-btn" onClick={() => handleDeleteAddress(address.id)} aria-label="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </section>
          )}

          {/* LOYALTY TAB */}
          {activeTab === 'loyalty' && (
            <section className="tab-section">
              <h2 className="tab-title">Spruce Loyalty Rewards</h2>
              <div className="loyalty-card">
                <div className="loyalty-points">
                  <Star size={40} className="text-gold" />
                  <div>
                    <h3 className="points-number">{user?.loyaltyPoints || 0} Points</h3>
                    <p className="points-tier">Welcome Tier</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <section className="tab-section">
              <h2 className="tab-title">Order History</h2>
              
              {orders.length === 0 ? (
                <div className="empty-state-wrapper">
                  <p className="empty-state-text">You haven't placed any orders yet.</p>
                  <Link href="/shop" className="browse-shop-btn">
                    BROWSE COLLECTION
                  </Link>
                </div>
              ) : (
                <div className="order-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      
                      <div className="order-header">
                        <div>
                          <p className="order-id">Order #{order.order_number}</p>
                          <p className="order-date">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`order-status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="order-details">
                        {order.order_items?.map((item: any) => (
                          <p key={item.id}>
                            {item.quantity}x {item.product_name} <span className="text-gray-500">({item.size})</span>
                          </p>
                        ))}
                      </div>
                      
                      <div className="order-footer">
                        <p className="order-total">Total: KSh {order.total_amount}</p>
                        <Link href="/shop" className="reorder-btn">Buy Again</Link>
                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
      <DashboardStyles />
    </div>
  );
}

// -------------------------
// STYLES COMPONENTS
// -------------------------
const AuthStyles = () => (
  <style>{`
    .auth-container {
      width: 100%;
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
    }

    .auth-card {
      width: 100%;
      max-width: 28rem;
      border: 1px solid #2A2A2A;
      padding: 3rem 2.5rem;
      background-color: transparent;
      display: flex;
      flex-direction: column;
    }

    .auth-title {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .auth-subtitle {
      color: #9ca3af;
      text-align: center;
      margin-bottom: 2.5rem;
      font-size: 0.875rem;
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-size: 0.625rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .form-group input {
      background: transparent;
      border: 1px solid #2A2A2A;
      padding: 1rem;
      color: #ffffff;
      transition: border-color 0.2s;
      width: 100%;
    }

    .form-group input:focus {
      outline: none;
      border-color: #788E7D;
    }
    
    .submit-btn {
      background: #788E7D;
      color: #ffffff;
      border: none;
      padding: 1rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      cursor: pointer;
      margin-top: 1rem;
      transition: background 0.2s;
    }

    .submit-btn:hover:not(:disabled) {
      background: #687C6D;
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .auth-toggle {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.875rem;
      color: #9ca3af;
    }

    .auth-toggle button {
      background: none;
      border: none;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 1px solid #ffffff;
      margin-left: 0.5rem;
      padding-bottom: 0.1rem;
    }
  `}</style>
);

const DashboardStyles = () => (
  <style>{`
    .loading-state {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .dashboard-container {
      width: 100%;
      max-width: 80rem;
      margin: 0 auto;
      padding: 4rem 2rem 8rem;
    }

    .dashboard-header {
      margin-bottom: 4rem;
      border-bottom: 1px solid #2A2A2A;
      padding-bottom: 2rem;
    }

    .dashboard-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #ffffff;
    }

    .dashboard-layout {
      display: flex;
      flex-direction: column;
      gap: 4rem;
    }

    @media (min-width: 1024px) {
      .dashboard-layout {
        flex-direction: row;
        align-items: flex-start;
      }
    }
    
    .dashboard-sidebar {
      width: 100%;
    }

    @media (min-width: 1024px) {
      .dashboard-sidebar {
        width: 16rem;
        flex-shrink: 0;
      }
    }

    .dashboard-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: transparent;
      border: 1px solid transparent;
      color: #9ca3af;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }

    .nav-item:hover {
      color: #ffffff;
    }

    .nav-item.active {
      border-color: #2A2A2A;
      color: #ffffff;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.02);
    }

    .logout-btn {
      margin-top: 2rem;
      color: #ef4444;
    }

    .logout-btn:hover {
      color: #f87171;
    }

    .dashboard-main {
      flex-grow: 1;
      width: 100%;
    }

    .tab-section {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .tab-header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .tab-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
    }
    
    .mb-0 {
      margin-bottom: 0 !important;
    }

    .add-new-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: 1px solid #788E7D;
      color: #788E7D;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.2s;
    }

    .add-new-btn:hover {
      background: #788E7D;
      color: #ffffff;
    }
    
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 40rem;
    }

    .form-row {
      display: flex;
      gap: 1.5rem;
      flex-direction: column;
    }

    @media (min-width: 768px) {
      .form-row {
        flex-direction: row;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .form-group label {
      font-size: 0.625rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .form-group input {
      background: transparent;
      border: 1px solid #2A2A2A;
      padding: 1rem;
      color: #ffffff;
      transition: border-color 0.2s;
      width: 100%;
    }

    .form-group input:focus {
      outline: none;
      border-color: #788E7D;
    }

    .disabled-input {
      opacity: 0.5;
      cursor: not-allowed;
      background: rgba(255,255,255,0.02) !important;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .checkbox-group input[type="checkbox"] {
      width: 1.25rem;
      height: 1.25rem;
      accent-color: #788E7D;
      cursor: pointer;
    }

    .checkbox-group label {
      color: #d1d5db;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    }

    .save-btn {
      background: #ffffff;
      color: #000000;
      border: 1px solid #ffffff;
      padding: 1rem 2rem;
      font-weight: 600;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.2s;
    }

    .save-btn:hover {
      background: transparent;
      color: #ffffff;
    }

    .cancel-btn {
      background: transparent;
      color: #9ca3af;
      border: none;
      padding: 1rem;
      font-weight: 600;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: color 0.2s;
    }

    .cancel-btn:hover {
      color: #ffffff;
    }

    .address-form-wrapper {
      border: 1px solid #2A2A2A;
      padding: 2rem;
      background: rgba(255,255,255,0.01);
      margin-bottom: 2rem;
    }

    .form-subtitle {
      font-size: 1.125rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #2A2A2A;
      padding-bottom: 1rem;
    }

    .address-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .address-list {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .address-card {
      border: 1px solid #2A2A2A;
      padding: 1.5rem;
      background: transparent;
      display: flex;
      flex-direction: column;
    }

    .address-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .address-name {
      font-weight: 600;
      color: #ffffff;
      font-size: 1.125rem;
    }

    .default-badge {
      background: rgba(120,142,125,0.2);
      color: #788E7D;
      padding: 0.25rem 0.5rem;
      font-size: 0.625rem;
      font-weight: 700;
      letter-spacing: 0.1em;
    }

    .address-line {
      color: #9ca3af;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .address-phone {
      color: #d1d5db;
      font-size: 0.875rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px dashed #2A2A2A;
    }

    .address-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #2A2A2A;
    }

    .action-link {
      background: transparent;
      border: none;
      color: #788E7D;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
    }

    .action-link:hover {
      text-decoration: underline;
    }

    .action-icons {
      display: flex;
      gap: 1rem;
      margin-left: auto;
    }

    .icon-btn {
      background: transparent;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 0.25rem;
      transition: color 0.2s;
    }

    .icon-btn:hover {
      color: #ffffff;
    }

    .delete-btn:hover {
      color: #ef4444;
    }

    .empty-state-text {
      color: #6b7280;
      font-size: 1rem;
    }
    
    .loyalty-card {
      border: 1px solid #788E7D;
      padding: 2rem;
      background: rgba(120, 142, 125, 0.1);
      max-width: 32rem;
    }

    .loyalty-points {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .text-gold {
      color: #fbbf24;
    }

    .points-number {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
    }

    .points-tier {
      color: #fbbf24;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
    }

    .empty-state-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
    }

    .browse-shop-btn {
      background: #ffffff;
      color: #000000;
      text-decoration: none;
      padding: 1rem 2rem;
      font-weight: 600;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      transition: all 0.2s;
    }

    .browse-shop-btn:hover {
      background: #e5e7eb;
    }

    .order-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .order-card {
      border: 1px solid #2A2A2A;
      padding: 1.5rem;
      background: transparent;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #2A2A2A;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }

    .order-id {
      font-weight: 600;
      color: #ffffff;
    }

    .order-date {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .order-status {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
    }

    .order-status.delivered { background: rgba(120,142,125,0.2); color: #788E7D; }
    .order-status.pending { background: rgba(251,191,36,0.1); color: #fbbf24; }
    
    .order-details {
      color: #d1d5db;
      margin-bottom: 1.5rem;
      line-height: 1.8;
      font-size: 0.875rem;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .order-total {
      font-weight: 600;
      color: #ffffff;
    }

    .reorder-btn {
      border: 1px solid #ffffff;
      background: transparent;
      color: #ffffff;
      text-decoration: none;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .reorder-btn:hover {
      background: #ffffff;
      color: #000000;
    }

    .auth-helpers {
      display: block;
      width: 100%;
      margin-top: -0.5rem;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #9ca3af;
      font-size: 0.875rem;
      cursor: pointer;
      margin-bottom: 1rem; 
    }

    .remember-me input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      accent-color: #788E7D;
      cursor: pointer;
    }

    .forgot-password {
      background: transparent;
      border: none;
      color: #9ca3af;
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0;
      display: block; 
      text-align: left;
    }

    .forgot-password:hover {
      color: #ffffff;
      text-decoration: underline;
    }
  `}</style>
);