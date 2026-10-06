"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface Variant {
  id: string;
  size: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  featured_image: string;
  gallery_images: string[];
  category: string;
  short_description: string;
  long_description: string;
  product_variants: Variant[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Cart store methods & state
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      
      const { data } = await supabase
        .from('products')
        .select('*, product_variants(id, price, size)')
        .eq('slug', slug)
        .single();
      
      if (data) {
        setProduct(data);
        setActiveImage(data.featured_image);
        if (data.product_variants && data.product_variants.length > 0) {
          setSelectedVariant(data.product_variants[0]);
        }
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  // Check how many of the currently selected size are in the cart
  const currentCartItem = mounted && selectedVariant 
    ? items.find((i) => i.id === selectedVariant.id) 
    : undefined;
  const currentQty = currentCartItem ? currentCartItem.quantity : 0;

  if (loading) {
    return <div className="loading-state">Loading botanical details...</div>;
  }

  if (!product) {
    return (
      <div className="error-state">
        <h2>Product not found</h2>
        <Link href="/shop" className="back-link">Return to Shop</Link>
      </div>
    );
  }

  const allImages = [product.featured_image, ...(product.gallery_images || [])].filter(Boolean);

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      addItem({
        id: selectedVariant.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        size: selectedVariant.size,
        price: selectedVariant.price,
        quantity: 1,
        image: product.featured_image
      });
    }
  };

  const handleDecrease = () => {
    if (!selectedVariant) return;
    if (currentQty === 1) {
      removeItem(selectedVariant.id);
    } else {
      updateQuantity(selectedVariant.id, -1);
    }
  };

  const handleIncrease = () => {
    if (!selectedVariant) return;
    updateQuantity(selectedVariant.id, 1);
  };

  return (
    <div className="product-page-container">
      
      {/* BREADCRUMBS */}
      <div className="breadcrumbs">
        <Link href="/shop" className="back-button">
          <ArrowLeft size={16} />
          <span>Back to Collection</span>
        </Link>
      </div>

      <div className="product-layout">
        
        {/* LEFT: IMAGE GALLERY */}
        <div className="product-gallery">
          <div className="main-image-wrapper">
            {activeImage && (
              <Image 
                src={activeImage} 
                alt={product.name} 
                fill
                className="main-image"
                priority
              />
            )}
          </div>
          
          {allImages.length > 1 && (
            <div className="thumbnail-list">
              {allImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`thumbnail-btn ${activeImage === img ? 'thumbnail-active' : ''}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="thumbnail-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: PRODUCT INFO & ACTIONS */}
        <div className="product-details">
          <p className="product-category">{product.category?.split('>').pop() || 'Botanical'}</p>
          <h1 className="product-title">{product.name}</h1>
          
          <p className="product-price">
            KSh {selectedVariant?.price || '0.00'}
          </p>
          
          <p className="product-short-desc">
            {product.short_description || "A luxurious handcrafted blend sourced from nature."}
          </p>

          {/* Size Selector */}
          {product.product_variants && product.product_variants.length > 0 && (
            <div className="variant-selector">
              <span className="selector-label">Size</span>
              <div className="size-options">
                {product.product_variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`size-btn ${selectedVariant?.id === variant.id ? 'size-active' : ''}`}
                  >
                    {variant.size === 'Default Title' ? 'Standard Size' : variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC CART ACTION: BUTTON VS QUANTITY CONTROLLER */}
          {currentQty === 0 ? (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              ADD TO CART — KSh {selectedVariant?.price}
            </button>
          ) : (
            <div className="cart-action-group">
              <div className="qty-control-bar">
                <button 
                  className="qty-action-btn" 
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>

                <div className="qty-display">
                  <span className="qty-count">{currentQty}</span>
                </div>

                <button 
                  className="qty-action-btn" 
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>

              <Link href="/cart" className="view-cart-btn">
                VIEW CART →
              </Link>
            </div>
          )}
          

          {/* LONG DESCRIPTION WITH EXPAND/COLLAPSE */}
          {product.long_description && (
            <div className="long-description-container">
              <h3 className="long-desc-title">The Details</h3>
              <div className="long-desc-content">
                <div className={`desc-text ${isDescriptionExpanded ? 'expanded' : 'collapsed'}`}>
                  {product.long_description}
                </div>
                {product.long_description.length > 150 && (
                  <button 
                    className="read-more-btn"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  >
                    {isDescriptionExpanded ? 'Read Less -' : 'Read More +'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INJECTED CLASSIC CSS */}
      <style>{`
        .product-page-container {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          padding: 2rem 2rem 6rem;
        }

        .loading-state, .error-state {
          height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }
        
        .error-state h2 {
          font-size: 2rem;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .breadcrumbs {
          margin-bottom: 3rem;
        }
        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }
        .back-button:hover {
          color: #ffffff;
        }

        .product-layout {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }
        @media (min-width: 1024px) {
          .product-layout {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        .product-gallery {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 1024px) {
          .product-gallery {
            width: 50%;
            position: sticky;
            top: 6rem;
          }
        }
        .main-image-wrapper {
          position: relative;
          aspect-ratio: 4 / 5;
          width: 100%;
          background-color: #1A1A1A;
        }
        .main-image {
          object-fit: cover;
        }
        .thumbnail-list {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }
        .thumbnail-btn {
          position: relative;
          width: 5rem;
          height: 5rem;
          flex-shrink: 0;
          border: 1px solid transparent;
          background-color: #1A1A1A;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .thumbnail-active {
          border-color: #ffffff;
        }
        .thumbnail-img {
          object-fit: cover;
        }

        .product-details {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 1024px) {
          .product-details {
            width: 50%;
            padding-left: 2rem;
          }
        }
        .product-category {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .product-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .product-price {
          font-size: 1.5rem;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 2rem;
        }
        .product-short-desc {
          font-size: 1.125rem;
          color: #d1d5db;
          line-height: 1.6;
          margin-bottom: 3rem;
        }

        .variant-selector {
          margin-bottom: 3rem;
        }
        .selector-label {
          display: block;
          font-size: 0.875rem;
          color: #9ca3af;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .size-btn {
          background: transparent;
          border: 1px solid #2A2A2A;
          color: #ffffff;
          padding: 0.75rem 2rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .size-btn:hover {
          border-color: #6b7280;
        }
        .size-active {
          border-color: #ffffff;
          background-color: #ffffff;
          color: #000000;
          font-weight: 600;
        }

        /* Standard Add to Cart */
        .add-to-cart-btn {
          width: 100%;
          background-color: #788E7D;
          color: #ffffff;
          border: none;
          padding: 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin-bottom: 1rem;
        }
        .add-to-cart-btn:hover {
          background-color: #687C6D;
        }

        /* Interactive Quantity Controller */
        .cart-action-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        @media (min-width: 640px) {
          .cart-action-group {
            flex-direction: row;
          }
        }
        .qty-control-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #788E7D;
          background-color: rgba(120, 142, 125, 0.1);
          flex-grow: 1;
        }
        .qty-action-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          padding: 1.25rem 1.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }
        .qty-action-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .qty-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .qty-count {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }
        .view-cart-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          color: #000000;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-decoration: none;
          padding: 1.25rem 2rem;
          transition: background-color 0.2s ease;
          white-space: nowrap;
        }
        .view-cart-btn:hover {
          background-color: #e5e7eb;
        }

        .shipping-notice {
          font-size: 0.75rem;
          color: #6b7280;
          text-align: center;
          margin-bottom: 4rem;
        }

        /* Long Description */
        .long-description-container {
          border-top: 1px solid #2A2A2A;
          padding-top: 3rem;
        }
        .long-desc-title {
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }
        .long-desc-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .desc-text {
          font-size: 1rem;
          color: #9ca3af;
          line-height: 1.8;
          white-space: pre-wrap;
        }
        .desc-text.collapsed {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .read-more-btn {
          background: transparent;
          border: none;
          color: #788E7D;
          font-weight: 600;
          font-size: 0.875rem;
          margin-top: 1rem;
          padding: 0;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .read-more-btn:hover {
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}