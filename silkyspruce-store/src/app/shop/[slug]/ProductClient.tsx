"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<any>(null);
  const [variations, setVariations] = useState<any[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // States for the Image Gallery
  const [allImages, setAllImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_variants (*)
        `)
        .eq('slug', slug)
        .single(); 

      if (data) {
        setProduct(data);
        
        // 1. Parse Gallery Images Safely
        let parsedGallery: string[] = [];
        if (data.gallery_images) {
          if (Array.isArray(data.gallery_images)) {
            parsedGallery = data.gallery_images;
          } else if (typeof data.gallery_images === 'string') {
            try {
              parsedGallery = JSON.parse(data.gallery_images);
            } catch (e) {
              parsedGallery = data.gallery_images
                .replace(/^\{|\}$/g, '')
                .split(',')
                .map((s: string) => s.replace(/^"|"$/g, '').trim())
                .filter(Boolean);
            }
          }
        }
        
        // 2. Extract Variant Images Upfront
        let variantImages: string[] = [];
        let sortedVariants: any[] = [];
        if (data.product_variants && data.product_variants.length > 0) {
          sortedVariants = data.product_variants.sort((a: any, b: any) => a.price - b.price);
          setVariations(sortedVariants);
          // Pull every image_url from the variants so it guarantees they are in the gallery
          variantImages = sortedVariants.map((v: any) => v.image_url).filter(Boolean);
        }
        
        // 3. Combine Featured, Gallery, and Variant images, then remove duplicates
        const rawImages = [data.featured_image, ...parsedGallery, ...variantImages].filter(Boolean);
        const uniqueImages = Array.from(new Set(rawImages));
        setAllImages(uniqueImages);
        
        // 4. Set Default Variation and Pre-select its image
        if (sortedVariants.length > 0) {
          const defaultVar = sortedVariants[0];
          setSelectedVariation(defaultVar);
          
          if (defaultVar.image_url) {
            const targetUrl = decodeURI(defaultVar.image_url).trim().toLowerCase();
            const explicitIdx = uniqueImages.findIndex(img => decodeURI(img).trim().toLowerCase() === targetUrl);
            if (explicitIdx !== -1) setCurrentImageIndex(explicitIdx);
          }
        }
      } else if (error) {
        console.error("Error fetching product:", error);
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedVariation) return;
    
    addItem({
      id: selectedVariation.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: selectedVariation.price,
      quantity: quantity,
      size: selectedVariation.size || 'Standard',
      image: allImages[currentImageIndex] || product.featured_image || '', 
    });
    
    alert(`${quantity}x ${product.name} (${selectedVariation.size || 'Standard'}) added to cart!`);
  };

  // BULLETPROOF IMAGE SWITCHING
  const handleSizeSelect = (v: any) => {
    setSelectedVariation(v);
    
    if (v.image_url) {
      // Decode URI to prevent "%20" vs " " mismatches
      const targetUrl = decodeURI(v.image_url).trim().toLowerCase();
      const explicitIdx = allImages.findIndex(img => decodeURI(img).trim().toLowerCase() === targetUrl);
      
      if (explicitIdx !== -1) {
        setCurrentImageIndex(explicitIdx);
      }
    } else {
      // Fallback: Link the 2nd size to the 2nd image if no URL is hardcoded
      const vIndex = variations.findIndex(varItem => varItem.id === v.id);
      if (vIndex !== -1 && vIndex < allImages.length) {
        setCurrentImageIndex(vIndex);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <h1 className="text-2xl mb-4">Product not found</h1>
        <Link href="/shop" className="underline text-gray-400 hover:text-white">
          Back to Shop
        </Link>
      </div>
    );
  }

  const shortDesc = product.short_description || "";
  const longDesc = product.long_description || "";
  const hasLongDesc = longDesc.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Image Column */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          
          {/* Main Display Image */}
          <div className="aspect-square relative overflow-hidden bg-[#1A1A1A]">
            {allImages.length > 0 ? (
              <Image 
                src={allImages[currentImageIndex] || allImages[0]} 
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}
          </div>
          
          {/* Thumbnails Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 border-2 transition ${
                    currentImageIndex === idx 
                      ? 'border-[#788E7D]' 
                      : 'border-transparent hover:border-[#2A2A2A]'
                  }`}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} thumbnail ${idx + 1}`} 
                    fill 
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <Link href="/shop" className="text-sm text-gray-400 hover:text-white mb-6 w-fit">
            &larr; Back to Shop
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>
          
          {selectedVariation ? (
            <>
              <p className="text-2xl text-[#788E7D] mb-6">KSh {selectedVariation.price}</p>
              
              {/* EXPANDABLE DESCRIPTION */}
              <div className="text-gray-400 mb-8 leading-relaxed whitespace-pre-wrap">
                {!isExpanded ? (
                  <p>
                    {shortDesc}
                    {hasLongDesc && shortDesc !== longDesc && "..."}
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p>{longDesc}</p>
                  </div>
                )}

                {hasLongDesc && shortDesc !== longDesc && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white text-sm font-semibold underline mt-3 block hover:text-[#788E7D] transition"
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* DYNAMIC VARIATION SELECTOR */}
              {variations.length > 1 && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                    {variations.some(v => v.size?.toLowerCase().includes('ml') || v.size?.toLowerCase().includes('g')) 
                      ? 'Select Size' 
                      : 'Select Option'}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {variations.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleSizeSelect(v)}
                        className={`px-5 py-2 border transition ${
                          selectedVariation?.id === v.id
                            ? 'border-[#788E7D] bg-[#788E7D] text-white'
                            : 'border-[#2A2A2A] text-gray-400 hover:border-gray-500 bg-transparent'
                        }`}
                      >
                        {v.size || 'Standard'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Controls */}
              <div className="flex items-center gap-4 mb-8 flex-wrap">
                <div className="flex items-center border border-[#2A2A2A] bg-transparent">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-white hover:bg-[#1A1A1A] transition"
                  >-</button>
                  <span className="px-4 py-3 text-white w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-white hover:bg-[#1A1A1A] transition"
                  >+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[200px] bg-[#788E7D] hover:bg-[#687C6D] text-white py-3 px-8 font-semibold tracking-wider transition"
                >
                  ADD TO CART
                </button>
              </div>
              
              <p className="text-sm text-gray-500">
                {selectedVariation.stock_quantity > 0 ? `${selectedVariation.stock_quantity} in stock` : 'Out of stock'}
              </p>
            </>
          ) : (
            <p className="text-xl text-red-400">Variations not configured for this product.</p>
          )}
        </div>
      </div>
    </div>
  );
}