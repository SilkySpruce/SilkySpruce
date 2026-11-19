"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { Star, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  featured_image: string;
  category: string;
  product_variants: { price: number; size: string }[];
}

const CATEGORIES = [
  "All Products", 
  "Body Oils", 
  "Hair Oils", 
  "Massage Oils", 
  "Lotions", 
  "Soaps", 
  "Body Butters", 
  "Essential Oils", 
  "Lip Care"
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState("All Products");
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, loginUser } = useUserStore();

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from('products')
        .select('*, product_variants(price, size)')
        .order('created_at', { ascending: false });
      
      if (data) setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    const fetchAndSetUserData = async (sessionUser: any) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('loyalty_points')
        .eq('id', sessionUser.id)
        .single();

      const phoneNumber = sessionUser.user_metadata?.phone || '';
      const fullName = sessionUser.user_metadata?.full_name || '';

      loginUser({
        id: sessionUser.id,
        email: sessionUser.email || '',
        firstName: fullName.split(' ')[0] || '',
        lastName: fullName.split(' ').slice(1).join(' ') || '',
        loyaltyPoints: profile?.loyalty_points || 0, 
        phone: phoneNumber,
      });
    };

    // Check if they already have an active session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchAndSetUserData(session.user);
      }
    };
    checkSession();

    // Listen for the link / email confirmation token in the URL
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchAndSetUserData(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [loginUser]);

  // Helper to grab a thumbnail image for each category circle from loaded products
  const getCategoryThumbnail = (category: string) => {
    if (category === "All Products") {
      return "/products/Cover picture1.jpeg.png";
    }
    const match = products.find(p => p.category && p.category.includes(category) && p.featured_image);
    return match?.featured_image || "/products/Rose water 250ml.jpeg";
  };

  // Dynamic filtering using the exact database categories
  const filteredProducts = products.filter(p => {
    if (activeFilter === "All Products" || activeFilter === "All") return true;
    if (p.category) {
      return p.category.includes(activeFilter);
    }
    return false;
  });

  return (
    <div className="page-container">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-background">
          <Image 
            src="/products/Cover picture1.jpeg.png" 
            fill 
            className="hero-image" 
            alt="Silky Spruce Cover" 
            priority
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <p className="hero-subtitle">Pure • Nourishing • Handcrafted</p>
          <h1 className="hero-title">
            Pure, Plant-Based Care <span className="gold-italic">from Head to Toe</span>
          </h1>
          
          <div className="hero-cta-group">
            <Link href="/shop" className="hero-button-primary">
              SHOP COLLECTION <ArrowRight size={16} />
            </Link>
            <Link href="/how-to-use" className="hero-button-secondary">
              HOW TO GUIDES
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CONTINUOUS HORIZONTAL TRUST TICKER */}
      <section className="trust-marquee" aria-label="Store Highlights">
        <div className="marquee-track">
          {[0, 1].map((loopIndex) => (
            <div key={loopIndex} className="marquee-group" aria-hidden={loopIndex === 1}>
              <div className="badge-item">
                <span className="badge-icon">🇰🇪</span>
                <span className="badge-text">Made in Kenya</span>
              </div>
              <span className="marquee-dot">•</span>
              <div className="badge-item">
                <span className="badge-icon">🚚</span>
                <span className="badge-text">Nairobi & Countrywide Delivery</span>
              </div>
              <span className="marquee-dot">•</span>
              <div className="badge-item">
                <span className="badge-icon">💳</span>
                <span className="badge-text">Pay with M-Pesa & Cards</span>
              </div>
              <span className="marquee-dot">•</span>
              <div className="badge-item">
                <span className="badge-icon">♻️</span>
                <span className="badge-text">Sustainable Packaging</span>
              </div>
              <span className="marquee-dot">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VISUAL CATEGORY SHORTCUTS & FEATURED PRODUCTS */}
      <section className="product-section">
        
        <div className="category-header">
          <span className="section-subtitle">Shop By Category</span>
        </div>

        {/* Visual Circular Category Strip */}
        <div className="category-circles-container">
          {CATEGORIES.map((category) => {
            const isActive = activeFilter === category;
            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`category-circle-btn ${isActive ? 'category-circle-active' : ''}`}
              >
                <div className="category-thumb-ring">
                  <div className="category-thumb-inner">
                    <Image
                      src={getCategoryThumbnail(category)}
                      alt={category}
                      fill
                      sizes="80px"
                      className="category-thumb-img"
                    />
                  </div>
                </div>
                <span className="category-circle-label">{category}</span>
              </button>
            );
          })}
        </div>

        <div className="section-header">
          <div>
            <h4 className="section-subtitle">Our Collection</h4>
            <h2 className="section-title">
              {activeFilter === "All Products" ? "Featured Products" : activeFilter}
            </h2>
          </div>
          <Link href="/shop" className="view-all-link">
            View all products
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">Loading our collection...</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.slice(0, 8).map((product, index) => (
              <Link href={`/shop/${product.slug}`} key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  {product.featured_image && (
                    <Image 
                      src={product.featured_image} 
                      alt={product.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      priority={index < 4}
                      className="product-image-card"
                    />
                  )}

                  {/* Desktop Hover Overlay */}
                  <div className="product-hover-overlay">
                    <span className="view-options-btn">View Options</span>
                  </div>
                </div>

                <div className="product-card-meta">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">
                    {product.product_variants && product.product_variants[0] 
                      ? `KSh ${product.product_variants[0].price}` 
                      : 'View Product'}
                  </p>
                  <span className="mobile-view-btn">View Options</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. SPRUCE LOYALTY REWARDS CALLOUT */}
      <section className="rewards-banner-section">
        <div className="rewards-banner-card">
          <div className="rewards-banner-left">
            <div className="rewards-icon-box">
              <Star size={24} className="gold-star-icon" />
            </div>
            <div>
              <p className="rewards-kicker">
                <Sparkles size={12} /> SPRUCE REWARDS
              </p>
              {isAuthenticated && user ? (
                <>
                  <h3 className="rewards-heading">
                    You have <span className="gold-text">{user.loyaltyPoints || 0} Points</span> available
                  </h3>
                  <p className="rewards-subtext">
                    Redeem your points directly at checkout for instant KSh savings on your next order.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="rewards-heading">
                    Earn <span className="gold-text">1 Point</span> for every KSh 100 spent
                  </h3>
                  <p className="rewards-subtext">
                    Unlock Seedling, Blossom & Evergreen perks and redeem points for discounts at checkout.
                  </p>
                </>
              )}
            </div>
          </div>

          <Link 
            href={isAuthenticated ? "/account?tab=loyalty" : "/account"} 
            className="rewards-cta-btn"
          >
            {isAuthenticated ? "VIEW MY REWARDS" : "JOIN FREE"}
          </Link>
        </div>
      </section>

      {/* 5. HOW TO GUIDES */}
      <section id="how-to-guides" className="how-to-section">
        
        <div className="how-to-divider">
          <div className="divider-line"></div>
          <h4 className="divider-text">How To Guide</h4>
          <div className="divider-line"></div>
        </div>

        <div className="how-to-grid">
          <div className="how-to-image-wrapper">
            <Image src="/products/Rose water 250ml.jpeg" fill className="how-to-image" alt="How to use body oils" />
          </div>
          <div className="how-to-text-content">
            <p className="how-to-subtitle">Body Oils Guide • 5 min read</p>
            <h2 className="how-to-title">How to Use Body Oils for Maximum Hydration</h2>
            <p className="how-to-body">
              The secret is in the application. Discover the damp skin method that locks in moisture for 24 hours and leaves skin visibly bright.
            </p>
            <div className="how-to-features">
              <p className="how-to-features-title">Featured in this guide</p>
              <div className="how-to-tags">
                <span className="tag">Anti acne Oil</span>
                <span className="tag">Rosehip Oil</span>
              </div>
            </div>
            <Link href="/how-to-use/body-oils-hydration" className="view-all-link">
              Read Full Guide
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .page-container {
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          width: 100%;
          height: 56vh;
          min-height: 430px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #2A2A2A;
          overflow: hidden;
        }
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }
        .hero-image {
          object-fit: cover;
          opacity: 0.35;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, #111111 5%, rgba(17,17,17,0.45) 60%, rgba(17,17,17,0.65) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1.25rem;
        }
        .hero-subtitle {
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          color: #D4AF37;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
          font-weight: 600;
        }
        .hero-title {
          font-size: 2.35rem;
          font-weight: 700;
          margin-bottom: 2.25rem;
          max-width: 54rem;
          line-height: 1.15;
          color: #ffffff;
          letter-spacing: -0.025em;
        }
        .gold-italic {
          color: #D4AF37;
          font-style: italic;
          font-weight: 600;
        }
        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }
        .hero-button-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #D4AF37;
          border: 1px solid #D4AF37;
          padding: 0.875rem 2rem;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #111111;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .hero-button-primary:hover {
          background-color: #E5C158;
          border-color: #E5C158;
          transform: translateY(-1px);
        }
        .hero-button-secondary {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.5);
          background: rgba(17, 17, 17, 0.4);
          backdrop-filter: blur(4px);
          padding: 0.875rem 2rem;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #ffffff;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .hero-button-secondary:hover {
          background-color: #ffffff;
          border-color: #ffffff;
          color: #111111;
        }

        /* Trust Badges */
        .trust-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-bottom: 1px solid #2A2A2A;
          background-color: #141414;
          padding: 0.9rem 0;
          display: flex;
          user-select: none;
          /* Smooth edge fade so text doesn't get sliced harshly at the screen edges */
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 28s linear infinite;
        }
        .trust-marquee:hover .marquee-track {
          animation-play-state: paused;
        }
        .marquee-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .badge-item {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0 1.25rem;
          white-space: nowrap;
        }
        .badge-icon {
          font-size: 1.05rem;
        }
        .badge-text {
          font-weight: 600;
          font-size: 0.78rem;
          color: #e5e7eb;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .marquee-dot {
          color: #D4AF37;
          font-size: 0.875rem;
          opacity: 0.85;
        }
        @media (min-width: 768px) {
          .trust-marquee {
            padding: 1.05rem 0;
            -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%);
          }
          .marquee-track {
            animation-duration: 36s;
          }
          .badge-item {
            padding: 0 2.75rem; /* Widens desktop breathing room so items don't crowd */
            gap: 0.65rem;
          }
        }
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Product & Visual Category Section */
        .product-section {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          padding: 3.5rem 1.5rem 4rem;
          box-sizing: border-box;
        }
        .category-header {
          margin-bottom: 1rem;
        }
        .category-circles-container {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          margin-bottom: 3.5rem;
          border-bottom: 1px solid #2A2A2A;
          padding-bottom: 2rem;
          overflow-x: auto;
          flex-wrap: nowrap;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .category-circles-container::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 1024px) {
          .category-circles-container {
            justify-content: space-between;
          }
        }
        .category-circle-btn {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.65rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          width: 5.5rem;
          transition: transform 0.2s ease;
        }
        .category-circle-btn:hover {
          transform: translateY(-2px);
        }
        .category-thumb-ring {
          width: 4.75rem;
          height: 4.75rem;
          border-radius: 9999px;
          padding: 3px;
          border: 1.5px solid #2A2A2A;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .category-circle-btn:hover .category-thumb-ring {
          border-color: rgba(212, 175, 55, 0.5);
        }
        .category-circle-active .category-thumb-ring {
          border-color: #D4AF37;
          box-shadow: 0 0 14px rgba(212, 175, 55, 0.28);
        }
        .category-thumb-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          overflow: hidden;
          background-color: #1A1A1A;
        }
        .category-thumb-img {
          object-fit: cover;
        }
        .category-circle-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #9ca3af;
          text-align: center;
          line-height: 1.25;
          transition: color 0.2s ease;
        }
        .category-circle-active .category-circle-label {
          color: #D4AF37;
          font-weight: 700;
        }
        
        /* Section Header */
        .section-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 768px) {
          .section-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            gap: 0;
          }
        }
        .section-subtitle {
          font-size: 0.625rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .section-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #ffffff;
        }
        .view-all-link {
          font-size: 0.875rem;
          color: #D4AF37;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 6px;
          transition: color 0.2s ease;
        }
        .view-all-link:hover {
          color: #ffffff;
        }

        /* Product Grid */
        .loading-state {
          height: 16rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* 2 compact columns on mobile instead of giant single cards */
          gap: 1.25rem;
        }
        .product-card {
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          width: 100%;
          border: 1px solid #2A2A2A;
          background-color: #141414;
          display: flex;
          flex-direction: column;
          transition: border-color 0.25s ease;
          overflow: hidden;
        }
        .product-card:hover {
          border-color: #D4AF37;
        }
        .product-image-wrapper {
          position: relative;
          aspect-ratio: 1 / 1;
          width: 100%;
          flex-shrink: 0;
          overflow: hidden;
          background-color: #1A1A1A;
        }
        .product-image-card {
          object-fit: cover;
          width: 100%;
          height: 100%;
          transition: transform 0.5s ease;
        }
        .product-card:hover .product-image-card {
          transform: scale(1.05);
        }
        .product-card-meta {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-grow: 1; 
          border-top: 1px solid #2A2A2A;
        }
        .product-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.35rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .product-price {
          color: #D4AF37;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .mobile-view-btn {
          margin-top: 0.75rem;
          display: block;
          text-align: center;
          border: 1px solid #2A2A2A;
          padding: 0.5rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #ffffff;
        }
        @media (min-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
          .mobile-view-btn {
            display: none;
          }
        }
        @media (min-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }

        /* Hover Overlay */
        .product-hover-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(to top, rgba(17,17,17,0.92), transparent);
          transform: translateY(100%);
          transition: transform 0.3s ease;
          display: flex;
          justify-content: center;
        }
        .product-card:hover .product-hover-overlay {
          transform: translateY(0);
        }
        .view-options-btn {
          background-color: #D4AF37;
          color: #111111;
          padding: 0.75rem 1.5rem;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          width: 100%;
          text-align: center;
          transition: background-color 0.2s ease;
        }
        .view-options-btn:hover {
          background-color: #E5C158;
        }

        /* Spruce Loyalty Rewards Strip */
        .rewards-banner-section {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1.5rem 2rem;
          box-sizing: border-box;
        }
        .rewards-banner-card {
          border: 1px solid rgba(212, 175, 55, 0.45);
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.09) 0%, rgba(20, 20, 20, 0.95) 100%);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .rewards-banner-card {
            flex-direction: row;
            align-items: center;
            padding: 2.25rem 2.75rem;
          }
        }
        .rewards-banner-left {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
        }
        @media (min-width: 768px) {
          .rewards-banner-left {
            align-items: center;
          }
        }
        .rewards-icon-box {
          width: 3.25rem;
          height: 3.25rem;
          border: 1px solid rgba(212, 175, 55, 0.4);
          background: rgba(17, 17, 17, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .gold-star-icon {
          color: #D4AF37;
        }
        .rewards-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #D4AF37;
          margin-bottom: 0.35rem;
        }
        .rewards-heading {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.35rem;
        }
        .gold-text {
          color: #D4AF37;
        }
        .rewards-subtext {
          font-size: 0.875rem;
          color: #d1d5db;
          line-height: 1.5;
        }
        .rewards-cta-btn {
          flex-shrink: 0;
          border: 1px solid #D4AF37;
          color: #D4AF37;
          background: transparent;
          padding: 0.875rem 1.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .rewards-cta-btn:hover {
          background: #D4AF37;
          color: #111111;
        }

        /* How To Section */
        .how-to-section {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          padding: 3.5rem 1.5rem 5rem;
          box-sizing: border-box;
        }
        .how-to-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 3rem;
        }
        .divider-line {
          height: 1px;
          background-color: #2A2A2A;
          flex-grow: 1;
        }
        .divider-text {
          font-size: 0.625rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9ca3af;
          margin: 0 1.5rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .how-to-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }
        .how-to-image-wrapper {
          position: relative;
          aspect-ratio: 1 / 1;
          width: 100%;
          border: 1px solid #2A2A2A;
        }
        .how-to-image {
          object-fit: cover;
        }
        .how-to-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .how-to-body {
          color: #d1d5db;
          margin-bottom: 2rem;
          line-height: 1.625;
          font-size: 1rem;
        }
        .how-to-features {
          margin-bottom: 2.5rem;
        }
        .how-to-features-title {
          font-size: 0.625rem;
          letter-spacing: 0.1em;
          color: #6b7280;
          margin-bottom: 1rem;
          text-transform: uppercase;
          font-weight: 600;
        }
        .how-to-tags {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .tag {
          border: 1px solid #2A2A2A;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          color: #d1d5db;
        }

        /* Tablet & Desktop Adjustments */
        @media (min-width: 768px) {
          .hero-title { font-size: 4rem; }
          .product-grid { 
            grid-template-columns: repeat(3, 1fr); 
            gap: 2rem;
          }
          .product-card { 
            max-width: none;
            margin: 0; 
          }
          .how-to-grid { grid-template-columns: 1fr 1fr; }
          .how-to-image-wrapper { aspect-ratio: 4 / 3; }
          .how-to-title { font-size: 2.25rem; }
          .how-to-body { font-size: 1.125rem; }
        }
        @media (min-width: 1024px) {
          .product-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </div>
  );
}