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
    if (activeFilter === "All") return true;
    if (activeFilter === "Body Oils") return p.name.includes("Oil") && !p.name.includes("Hair") && !p.name.includes("Massage") && !p.name.includes("Essential");
    if (activeFilter === "Hair Oils") return p.name.includes("Hair") || p.name.includes("Growth");
    if (activeFilter === "Massage Oils") return p.name.includes("Massage");
    if (activeFilter === "Lotions") return p.name.includes("Lotion");
    if (activeFilter === "Soaps") return p.name.includes("Soap");
    if (activeFilter === "Body Butters") return p.name.includes("Butter");
    if (activeFilter === "Essential Oils") return p.name.includes("Essential Oil");
    if (activeFilter === "Lip Care") return p.name.includes("Lip");
    return true;
  });

  return (
    <div className="shop-container">
      
      {/* SHOP HEADER */}
      <div className="shop-header">
        <h1 className="shop-title">The Collection</h1>
        <p className="shop-description">
          Handcrafted botanical remedies sourced from nature. Filter by category to find your perfect ritual.
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
              {filteredProducts.map((product) => (
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
                    
                    {/* Hover Overlay */}
                    <div className="product-hover-overlay">
                      <span className="view-options-btn">View Options</span>
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">
                      {product.product_variants.length > 1 ? 'From ' : ''}
                      KSh {product.product_variants[0]?.price}
                    </p>
                  </div>
                </Link>
              ))}
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
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .shop-header {
          text-align: center;
          margin-bottom: 4rem;
          border-bottom: 1px solid #2A2A2A;
          padding-bottom: 4rem;
        }
        .shop-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }
        .shop-description {
          color: #9ca3af;
          font-size: 1.125rem;
          max-width: 32rem;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* Layout Setup */
        .shop-layout {
          display: flex;
          flex-direction: column;
          gap: 3rem;
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
          position: sticky;
          top: 6rem;
        }
        @media (min-width: 1024px) {
          .shop-sidebar {
            width: 16rem;
            flex-shrink: 0;
            border-right: 1px solid #2A2A2A;
            padding-right: 2rem;
            min-height: 50vh;
          }
        }
        .sidebar-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b7280;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        .sidebar-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        @media (min-width: 1024px) {
          .sidebar-list {
            flex-direction: column;
            gap: 0;
          }
        }
        .sidebar-button {
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 0;
          transition: color 0.2s ease;
          text-align: left;
        }
        @media (max-width: 1023px) {
          .sidebar-button {
            border: 1px solid #2A2A2A;
            padding: 0.5rem 1rem;
          }
        }
        .sidebar-button:hover {
          color: #ffffff;
        }
        .sidebar-button-active {
          color: #ffffff;
          font-weight: 600;
        }
        @media (max-width: 1023px) {
          .sidebar-button-active {
            border-color: #788E7D;
            background-color: #788E7D;
          }
        }
        .sidebar-active-dot {
          width: 6px;
          height: 6px;
          background-color: #788E7D;
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
        }
        .shop-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #2A2A2A;
        }
        .results-count {
          color: #9ca3af;
          font-size: 0.875rem;
        }
        .loading-state {
          height: 20rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          font-size: 1.125rem;
        }

        /* Grid & Cards */
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .shop-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1280px) {
          .shop-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .product-card {
          text-decoration: none;
          color: inherit;
          display: block;
          group;
        }
        .product-image-wrapper {
          position: relative;
          aspect-ratio: 4 / 5;
          width: 100%;
          background-color: #1A1A1A;
          overflow: hidden;
          margin-bottom: 1.25rem;
        }
        .product-image {
          object-fit: cover;
          transition: transform 0.7s ease;
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
        }
        
        /* Hover Add To Cart / View Options */
        .product-hover-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(to top, rgba(17,17,17,0.9), transparent);
          transform: translateY(100%);
          transition: transform 0.3s ease;
          display: flex;
          justify-content: center;
        }
        .product-card:hover .product-hover-overlay {
          transform: translateY(0);
        }
        .view-options-btn {
          background-color: #ffffff;
          color: #000000;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          width: 100%;
          text-align: center;
          transition: background-color 0.2s ease;
        }
        .view-options-btn:hover {
          background-color: #e5e7eb;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .product-name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          transition: color 0.2s ease;
        }
        .product-card:hover .product-name {
          color: #788E7D;
        }
        .product-price {
          color: #9ca3af;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}