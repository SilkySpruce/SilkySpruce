// src/app/shop/[slug]/ProductClient.tsx
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export default function ProductClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<any>(null);
  const [variations, setVariations] = useState<any[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false); // <-- Added state for Read More
  
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
        
        if (data.product_variants && data.product_variants.length > 0) {
          const sortedVariants = data.product_variants.sort((a: any, b: any) => a.price - b.price);
          setVariations(sortedVariants);
          setSelectedVariation(sortedVariants[0]);
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
      image: product.featured_image || '', 
    });
    
    alert(`${quantity}x ${product.name} (${selectedVariation.size || 'Standard'}) added to cart!`);
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

  // Safely extract descriptions
  const shortDesc = product.short_description || "";
  const longDesc = product.long_description || "";
  const hasLongDesc = longDesc.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Image Column */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square relative overflow-hidden bg-[#1A1A1A]">
            {product.featured_image ? (
              <img 
                src={product.featured_image} 
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Details Column */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <Link href="/shop" className="text-sm text-gray-400 hover:text-white mb-6 w-fit">
            &larr; Back to Shop
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
          
          {selectedVariation ? (
            <>
              <p className="text-2xl text-[#788E7D] mb-6">KSh {selectedVariation.price}</p>
              
              {/* EXPANDABLE DESCRIPTION */}
              <div className="text-gray-400 mb-8 leading-relaxed whitespace-pre-wrap">
                {!isExpanded ? (
                  <p>
                    {shortDesc}
                    {hasLongDesc && "..."}
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p>{shortDesc}</p>
                    <p>{longDesc}</p>
                  </div>
                )}

                {hasLongDesc && (
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
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {variations.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariation(v)}
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
              <div className="flex items-center gap-4 mb-8">
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
                  className="flex-1 bg-[#788E7D] hover:bg-[#687C6D] text-white py-3 px-8 font-semibold tracking-wider transition"
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