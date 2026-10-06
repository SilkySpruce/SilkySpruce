"use client";

import { useState } from 'react';
import { Package, MapPin, Star, Heart, User, LogOut, Mail } from 'lucide-react';

export default function AccountPage() {
  // Demo states to toggle between Auth and Dashboard views without needing a real backend yet
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState('profile');

  // Simulated Login Function
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  // -------------------------
  // VIEW 1: AUTHENTICATION
  // -------------------------
  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">My Account</h1>
          <p className="auth-subtitle">
            {authMode === 'login' ? 'Sign in to access your rituals.' : 'Create an account to join the community.'}
          </p>

          <button className="google-btn" onClick={() => setIsLoggedIn(true)}>
            <Mail size={18} />
            <span>Continue with Google</span>
          </button>

          <div className="auth-divider">
            <span>or email</span>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === 'signup' && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required placeholder="Jane Doe" />
              </div>
            )}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required placeholder="••••••••" />
            </div>
            
            <button type="submit" className="submit-btn">
              {authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="auth-toggle">
            {authMode === 'login' ? (
              <p>Don't have an account? <button onClick={() => setAuthMode('signup')}>Sign up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setAuthMode('login')}>Sign in</button></p>
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
        <h1 className="dashboard-title">Welcome back, Jane</h1>
      </div>

      <div className="dashboard-layout">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <User size={18} /> <span>Profile Info</span>
            </button>
            <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <Package size={18} /> <span>Order History</span>
            </button>
            <button className={`nav-item ${activeTab === 'loyalty' ? 'active' : ''}`} onClick={() => setActiveTab('loyalty')}>
              <Star size={18} /> <span>Loyalty Points</span>
            </button>
            <button className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
              <MapPin size={18} /> <span>Address Book</span>
            </button>
            <button className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>
              <Heart size={18} /> <span>Wishlist</span>
            </button>
            <button className="nav-item logout-btn" onClick={() => setIsLoggedIn(false)}>
              <LogOut size={18} /> <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="dashboard-main">
          
          {activeTab === 'profile' && (
            <section className="tab-section">
              <h2 className="tab-title">Profile Information</h2>
              <form className="profile-form">
                <div className="form-row">
                  <div className="form-group"><label>First Name</label><input type="text" defaultValue="Jane" /></div>
                  <div className="form-group"><label>Last Name</label><input type="text" defaultValue="Doe" /></div>
                </div>
                <div className="form-group"><label>Email Address</label><input type="email" defaultValue="jane@example.com" disabled /></div>
                <div className="form-group"><label>Phone Number</label><input type="tel" placeholder="+254 700 000 000" /></div>
                <button className="save-btn" type="button">SAVE CHANGES</button>
              </form>
            </section>
          )}

          {activeTab === 'loyalty' && (
            <section className="tab-section">
              <h2 className="tab-title">Spruce Loyalty Rewards</h2>
              <div className="loyalty-card">
                <div className="loyalty-points">
                  <Star size={40} className="text-gold" />
                  <div>
                    <h3 className="points-number">450 Points</h3>
                    <p className="points-tier">Silver Tier</p>
                  </div>
                </div>
                <p className="loyalty-desc">You are 50 points away from unlocking a KSh 1,000 discount on your next purchase.</p>
                <button className="redeem-btn">REDEEM POINTS</button>
              </div>
            </section>
          )}

          {activeTab === 'orders' && (
            <section className="tab-section">
              <h2 className="tab-title">Order History</h2>
              <div className="order-list">
                <div className="order-card">
                  <div className="order-header">
                    <div>
                      <p className="order-id">Order #SS-2094</p>
                      <p className="order-date">Oct 1, 2026</p>
                    </div>
                    <span className="order-status delivered">Delivered</span>
                  </div>
                  <div className="order-details">
                    <p>1x Silky Spruce Hair Growth Gel (250ml)</p>
                    <p>1x Silky Spruce Essential Oil – Rose</p>
                  </div>
                  <div className="order-footer">
                    <p className="order-total">Total: KSh 2,320</p>
                    <button className="reorder-btn">Buy Again</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'addresses' && (
            <section className="tab-section">
              <h2 className="tab-title">Address Book</h2>
              <div className="address-card">
                <p className="address-name">Jane Doe (Default)</p>
                <p className="address-line">123 Westlands Road</p>
                <p className="address-line">Apartment 4B</p>
                <p className="address-line">Nairobi, Kenya</p>
                <div className="address-actions">
                  <button>Edit</button>
                  <button>Delete</button>
                </div>
              </div>
              <button className="add-address-btn">+ Add New Address</button>
            </section>
          )}

          {activeTab === 'wishlist' && (
            <section className="tab-section">
              <h2 className="tab-title">Your Wishlist</h2>
              <p className="empty-state">You haven't saved any botanicals yet.</p>
              <button className="browse-btn">Explore the Collection</button>
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
    .google-btn { 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        gap: 0.75rem; 
        width: 100%; 
        background: transparent; 
        border: 1px solid #ffffff; 
        color: #ffffff; 
        padding: 1rem; 
        font-weight: 600; 
        cursor: pointer; 
        transition: all 0.2s; 
    }
    .google-btn:hover { 
        background: #ffffff; 
        color: #000000; 
    }
    .auth-divider { 
        display: flex; 
        align-items: center; 
        text-align: center; 
        margin: 2rem 0; 
        color: #6b7280; 
        font-size: 0.75rem; 
        text-transform: uppercase; 
        letter-spacing: 0.1em; 
    }
    .auth-divider::before, .auth-divider::after { 
        content: ''; 
        flex: 1; 
        border-bottom: 1px solid #2A2A2A; 
    }
    .auth-divider span { 
        padding: 0 1rem; 
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
    .submit-btn:hover { 
        background: #687C6D; 
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
    .dashboard-container { 
        width: 100%; 
        max-width: 80rem; 
        margin: 0 auto; 
        padding: 4rem 2rem 8rem; 
    }
    .dashboard-header { 
        margin-bottom: 4rem; 
        border-bottom: 1px solid #2A2A2A; padding-bottom: 2rem; 
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

    /* Sidebar */
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
        background: rgba(255,255,255,0.02); 
    }
    .logout-btn { 
        margin-top: 2rem; 
        color: #ef4444; 
    }
    .logout-btn:hover { 
        color: #f87171; 
    }

    /* Main Content */
    .dashboard-main { 
        flex-grow: 1; 
        width: 100%; 
    }
    .tab-section { 
        animation: fadeIn 0.3s ease; 
    }
    @keyframes fadeIn { 
        from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } 
    }
    .tab-title { 
        font-size: 1.5rem; 
        font-weight: 600; 
        color: #ffffff; 
        margin-bottom: 2rem; 
    }

    /* Forms */
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
    .save-btn { 
        background: #ffffff; 
        color: #000000; 
        border: none; 
        padding: 1rem 2rem; 
        font-weight: 600; 
        cursor: pointer; 
        align-self: flex-start; 
        margin-top: 1rem; 
    }

    /* Loyalty Card */
    .loyalty-card { 
        border: 1px solid #788E7D; 
        padding: 2rem; 
        background: rgba(120,142,125,0.1); 
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
    .loyalty-desc { 
        color: #d1d5db; 
        margin-bottom: 2rem; 
        line-height: 1.6; 
    }
    .redeem-btn { 
        background: #788E7D; 
        color: #ffffff; 
        border: none; 
        padding: 0.75rem 1.5rem; 
        font-weight: 600; 
        cursor: pointer; 
    }

    /* Orders & Addresses */
    .order-card, .address-card { 
        border: 1px solid #2A2A2A; 
        padding: 1.5rem; 
        margin-bottom: 1.5rem; 
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
    .order-status.delivered { 
        background: rgba(120,142,125,0.2); 
        color: #788E7D; 
    }
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
        padding: 0.5rem 1rem; 
        font-size: 0.75rem; 
        font-weight: 600; 
        cursor: pointer; 
    }

    .address-name { 
        font-weight: 600; 
        color: #ffffff; 
        margin-bottom: 0.5rem; 
    }
    .address-line { 
        color: #9ca3af; 
        margin-bottom: 0.25rem; 
        font-size: 0.875rem; 
    }
    .address-actions { 
        display: flex; 
        gap: 1rem; 
        margin-top: 1rem; 
    }
    .address-actions button { 
        background: none; 
        border: none; color: #788E7D; 
        font-size: 0.875rem; 
        cursor: pointer; padding: 0; 
    }
    .add-address-btn { 
        border: 1px dashed #2A2A2A; 
        background: transparent; 
        color: #9ca3af; 
        width: 100%; 
        padding: 1.5rem; 
        cursor: pointer; 
        font-weight: 600; 
        transition: color 0.2s, border-color 0.2s; 
    }
    .add-address-btn:hover { 
        color: #ffffff; 
        border-color: #ffffff; 
    }

    .empty-state { 
        color: #9ca3af; 
        margin-bottom: 1.5rem; 
    }
    .browse-btn { 
        border-bottom: 1px solid #ffffff; 
        color: #ffffff; 
        background: none; 
        padding: 0 0 0.25rem 0; 
        cursor: pointer; 
        font-weight: 600; 
    }
  `}</style>
);