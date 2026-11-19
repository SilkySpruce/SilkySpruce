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

const CATEGORIES = ["All", "Body Oils", "Hair Oils", "Massage Oils", "Lotions", "Soaps", "Body Butters", "Essential Oils", "Lip Care"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
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
    if (activeFilter === "All" || activeFilter === "All Products") return true;
    
    if (p.category) {
      return p.category.includes(activeFilter);
    }
    
    return false;
  });

  return (
    <div className="shop-container">
      
      {/* SHOP HEADER */}
      <div className="shop-header">
        <p className="shop-kicker">Plant Based Remedies</p>
        <h1 className="shop-title">
          The <span className="gold-italic">Collection</span>
        </h1>
        <p className="shop-description">
          Handcrafted plant based remedies sourced from nature. Filter by category to find your perfect routine.
        </p>
      </div>

      <div className="shop-layout">
        
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className="shop-sidebar">
          <h3 className="sidebar-title">Categories</h3>
          <ul className="sidebar-list">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setActiveFilter(category)}
                  className={`sidebar-button ${activeFilter === category ? 'sidebar-button-active' : ''}`}
                >
                  <span className="sidebar-button-text">{category}</span>
                  {activeFilter === category && <span className="sidebar-active-dot"></span>}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* RIGHT AREA: PRODUCT GRID */}
        <main className="shop-main">
          
          <div className="shop-toolbar">
            <span className="results-count">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {loading ? (
            <div className="loading-state">Loading the collection...</div>
          ) : (
            <div className="shop-grid">
              {filteredProducts.map((product) => {
                const sortedPrices = [...(product.product_variants || [])]
                  .map(v => v.price)
                  .sort((a, b) => a - b);
                const displayPrice = sortedPrices[0];

                return (
                  <Link href={`/shop/${product.slug}`} key={product.id} className="product-card">
                    <div className="product-image-wrapper">
                      {product.featured_image ? (
                        <Image 
                          src={product.featured_image} 
                          alt={product.name} 
                          fill
                          className="product-image"
                        />
                      ) : (
                        <div className="product-image-placeholder">No Image</div>
                      )}
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-footer">
                        <p className="product-price">
                          {displayPrice !== undefined ? `KSh ${displayPrice.toLocaleString()}` : 'View Details'}
                        </p>
                        <span className="view-options-btn">VIEW OPTIONS</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* INJECTED CLASSIC CSS */}
      <style>{`
        .shop-container {
          width: 100%;
          max-width: 90rem;
          margin: 0 auto;
          padding: 4rem 2rem 6rem;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .shop-header {
          text-align: center;
          margin-bottom: 3.5rem;
          border-bottom: 1px solid #2A2A2A;
          padding-bottom: 3.5rem;
        }
        .shop-kicker {
          font-size: 0.8125rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .shop-title {
          font-size: 2.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
          letter-spacing: -0.02em;
        }
        @media (min-width: 768px) {
          .shop-title {
            font-size: 3.75rem;
          }
        }
        .gold-italic {
          color: #D4AF37;
          font-style: italic;
          font-weight: 600;
        }
        .shop-description {
          color: #9ca3af;
          font-size: 1.0625rem;
          max-width: 34rem;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Layout Setup */
        .shop-layout {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        @media (min-width: 1024px) {
          .shop-layout {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        /* Sidebar Filters */
        .shop-sidebar {
          width: 100%;
          position: relative;
        }
        @media (min-width: 1024px) {
          .shop-sidebar {
            width: 14.5rem;
            flex-shrink: 0;
            border-right: 1px solid #2A2A2A;
            padding-right: 1.75rem;
            min-height: 50vh;
            position: sticky;
            top: 6rem;
          }
        }
        .sidebar-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #D4AF37;
          margin-bottom: 1.25rem;
          font-weight: 700;
          display: none;
        }
        @media (min-width: 1024px) {
          .sidebar-title {
            display: block;
          }
        }

        /* Mobile vs Desktop List Styling */
        .sidebar-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 0.625rem;
          overflow-x: auto;
          flex-wrap: nowrap;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 0.5rem;
        }
        .sidebar-list::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 1024px) {
          .sidebar-list {
            flex-direction: column;
            gap: 0;
            overflow-x: visible;
            flex-wrap: wrap;
            padding-bottom: 0;
          }
        }

        .sidebar-button {
          background: transparent;
          border: 1px solid #2A2A2A;
          color: #9ca3af;
          cursor: pointer;
          font-size: 0.8125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
          white-space: nowrap;
        }

        @media (min-width: 1024px) {
          .sidebar-button {
            border: none;
            padding: 0.65rem 0;
            font-size: 0.9375rem;
            justify-content: space-between;
            width: 100%;
            text-align: left;
            white-space: normal;
          }
        }

        .sidebar-button:hover {
          color: #ffffff;
        }

        .sidebar-button-active {
          color: #111111;
          font-weight: 700;
          border-color: #D4AF37;
          background-color: #D4AF37;
        }

        @media (min-width: 1024px) {
          .sidebar-button-active {
            background-color: transparent;
            color: #D4AF37;
            font-weight: 600;
          }
        }

        .sidebar-active-dot {
          width: 6px;
          height: 6px;
          background-color: #D4AF37;
          border-radius: 50%;
          display: none;
        }
        @media (min-width: 1024px) {
          .sidebar-active-dot {
            display: block;
          }
        }

        /* Main Grid Area */
        .shop-main {
          flex-grow: 1;
          width: 100%;
        }
        .shop-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
          padding-bottom: 0.875rem;
          border-bottom: 1px solid #2A2A2A;
        }
        .results-count {
          color: #9ca3af;
          font-size: 0.8125rem;
        }
        .loading-state {
          height: 20rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 1rem;
        }

        /* Compact Grid & Cards */
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (min-width: 768px) {
          .shop-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }
        @media (min-width: 1280px) {
          .shop-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .product-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          background-color: #141414;
          border: 1px solid #2A2A2A;
          transition: border-color 0.25s ease;
        }
        .product-card:hover {
          border-color: rgba(212, 175, 55, 0.55);
        }
        .product-image-wrapper {
          position: relative;
          aspect-ratio: 1 / 1;
          width: 100%;
          background-color: #1A1A1A;
          overflow: hidden;
          border-bottom: 1px solid #2A2A2A;
        }
        .product-image {
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .product-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4b5563;
          font-size: 0.8125rem;
        }

        .product-info {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex-grow: 1;
        }
        .product-name {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.35;
          margin-bottom: 0.75rem;
          transition: color 0.2s ease;
        }
        .product-card:hover .product-name {
          color: #D4AF37;
        }

        .product-footer {
          margin-top: auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.65rem;
        }
        .product-price {
          color: #D4AF37;
          font-size: 0.9375rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .view-options-btn {
          display: block;
          width: 100%;
          background-color: transparent;
          border: 1px solid #D4AF37;
          color: #D4AF37;
          padding: 0.55rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
          transition: all 0.2s ease;
        }
        .product-card:hover .view-options-btn {
          background-color: #D4AF37;
          color: #111111;
        }
      `}</style>
    </div>
  );
}