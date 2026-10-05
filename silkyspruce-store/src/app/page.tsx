"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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

const CATEGORIES = ["All Products", "Body Oils", "Hair Oils", "Massage Oils", "Lotions", "Soaps", "Body Butters"];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState("All Products");
  const [loading, setLoading] = useState(true);

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

  const filteredProducts = products.filter(p => {
    if (activeFilter === "All Products") return true;
    if (activeFilter === "Body Oils") return p.name.includes("Oil") && !p.name.includes("Hair") && !p.name.includes("Massage");
    if (activeFilter === "Hair Oils") return p.name.includes("Hair") || p.name.includes("Growth");
    if (activeFilter === "Massage Oils") return p.name.includes("Massage");
    if (activeFilter === "Lotions") return p.name.includes("Lotion");
    if (activeFilter === "Soaps") return p.name.includes("Soap");
    if (activeFilter === "Body Butters") return p.name.includes("Butter");
    return true;
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
          <p className="hero-subtitle">Pure • Plant-Based • Handcrafted</p>
          <h1 className="hero-title">Nature's Touch for Sensitive Skin</h1>
          <Link href="#how-to-guides" className="hero-button">
            HOW-TO GUIDES
          </Link>
        </div>
      </section>

      {/* 2. TRUST BADGES */}
      <section className="trust-badges">
        <div className="badge-item">
          <span className="badge-icon">🇰🇪</span>
          <span className="badge-text">Made in Kenya</span>
        </div>
        <div className="badge-item">
          <span className="badge-icon">♻️</span>
          <span className="badge-text">Sustainable Packaging</span>
        </div>
      </section>

      {/* 3. PRODUCT GRID & FILTERS */}
      <section className="product-section">
        <div className="filter-container">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`filter-button ${activeFilter === category ? 'filter-active' : 'filter-inactive'}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="section-header">
          <div>
            <h4 className="section-subtitle">Our Collection</h4>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link href="/shop" className="view-all-link">
            View all products
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">Loading botanicals...</div>
        ) : (
          <div className="product-grid">
            {filteredProducts.slice(0, 8).map((product) => (
              <Link href={`/shop/${product.slug}`} key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  {product.featured_image && (
                    <Image 
                      src={product.featured_image} 
                      alt={product.name} 
                      fill
                      className="product-image-card"
                    />
                  )}
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">KSh {product.product_variants[0]?.price}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. HOW-TO GUIDES */}
      <section id="how-to-guides" className="how-to-section">
        <div className="how-to-divider">
          <div className="divider-line"></div>
          <h4 className="divider-text">How-To Guide</h4>
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
              The secret is in the application - discover the damp-skin method that locks in moisture for 24 hours and leaves skin visibly luminous.
            </p>
            <div className="how-to-features">
              <p className="how-to-features-title">Featured in this guide</p>
              <div className="how-to-tags">
                <span className="tag">Anti-acne Oil</span>
                <span className="tag">Rosehip Oil</span>
              </div>
            </div>
            <Link href="/blog" className="view-all-link">
              Read Full Guide →
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .page-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          width: 100%;
          height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #2A2A2A;
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
          opacity: 0.3;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, #111111, transparent);
        }
        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1rem;
        }
        .hero-subtitle {
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          color: #9ca3af;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          font-weight: 600;
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 2.5rem;
          max-width: 56rem;
          line-height: 1.2;
          color: #ffffff;
          letter-spacing: -0.025em;
        }
        .hero-button {
          border: 1px solid #ffffff;
          padding: 0.75rem 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #ffffff;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .hero-button:hover {
          background-color: #ffffff;
          color: #000000;
        }

        /* Trust Badges */
        .trust-badges {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: flex;
          justify-content: center;
          gap: 4rem;
          border-bottom: 1px solid #2A2A2A;
        }
        .badge-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .badge-icon {
          font-size: 1.5rem;
        }
        .badge-text {
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.025em;
        }

        /* Product Section */
        .product-section {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          padding: 5rem 2rem;
        }
        .filter-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
          margin-bottom: 4rem;
          border-bottom: 1px solid #2A2A2A;
          padding-bottom: 2rem;
        }
        .filter-button {
          padding: 0.5rem 1.25rem;
          border: 1px solid #2A2A2A;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          cursor: pointer;
          background-color: transparent;
        }
        .filter-active {
          border-color: #788E7D;
          background-color: #788E7D;
          color: #ffffff;
        }
        .filter-inactive {
          color: #9ca3af;
        }
        .filter-inactive:hover {
          color: #ffffff;
          border-color: #6b7280;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        .section-subtitle {
          font-size: 0.625rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .section-title {
          font-size: 1.875rem;
          font-weight: 700;
        }
        .view-all-link {
          font-size: 0.875rem;
          border-bottom: 1px solid #ffffff;
          padding-bottom: 0.25rem;
          color: #ffffff;
          text-decoration: none;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .view-all-link:hover {
          color: #d1d5db;
          border-color: #d1d5db;
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
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        .product-card {
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .product-image-wrapper {
          position: relative;
          aspect-ratio: 4 / 5;
          width: 100%;
          margin-bottom: 1rem;
          overflow: hidden;
          background-color: #1A1A1A;
        }
        .product-image-card {
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-card:hover .product-image-card {
          transform: scale(1.05);
        }
        .product-name {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          transition: color 0.2s ease;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .product-card:hover .product-name {
          color: #788E7D;
        }
        .product-price {
          color: #9ca3af;
          font-size: 0.875rem;
        }

        /* How-To Section */
        .how-to-section {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          padding: 5rem 2rem;
          border-top: 1px solid #2A2A2A;
        }
        .how-to-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4rem;
        }
        .divider-line {
          height: 1px;
          background-color: #2A2A2A;
          flex-grow: 1;
        }
        .divider-text {
          font-size: 0.625rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin: 0 1.5rem;
          font-weight: 600;
        }
        .how-to-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }
        .how-to-image-wrapper {
          position: relative;
          aspect-ratio: 1 / 1;
          width: 100%;
        }
        .how-to-image {
          object-fit: cover;
        }
        .how-to-subtitle {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: #9ca3af;
          margin-bottom: 1rem;
          text-transform: uppercase;
        }
        .how-to-title {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .how-to-body {
          color: #d1d5db;
          margin-bottom: 2.5rem;
          line-height: 1.625;
          font-size: 1.125rem;
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
        }
        .tag {
          border: 1px solid #2A2A2A;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: #d1d5db;
        }

        /* Responsive Breakpoints */
        @media (min-width: 768px) {
          .hero-title { font-size: 4.5rem; }
          .product-grid { grid-template-columns: repeat(2, 1fr); }
          .how-to-grid { grid-template-columns: 1fr 1fr; }
          .how-to-image-wrapper { aspect-ratio: 4 / 3; }
        }
        @media (min-width: 1024px) {
          .product-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </div>
  );
}