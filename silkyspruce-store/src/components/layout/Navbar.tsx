"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Wait until hydration is complete to read local storage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounced Supabase Search
  useEffect(() => {
    const fetchResults = async () => {
      // Only search if the user has typed at least 2 characters
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, featured_image, category')
        .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(5); // Show top 5 autocomplete results
        
      if (data) setSearchResults(data);
    };

    // Wait 300ms after the user stops typing before fetching
    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <nav className="w-full border-b border-[#2A2A2A] bg-[#111111] px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      
      {/* Logo */}
      <Link href="/" className="flex-shrink-0" onClick={closeSearch}>
        <Image 
          src="/products/Silky Logo.png" 
          alt="Silky Spruce Logo" 
          width={120} 
          height={40} 
          className="object-contain"
        />
      </Link>

      {/* Center Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/shop" className="text-sm font-semibold hover:text-gray-300 transition-colors">Collection</Link>
        <Link href="/about-us" className="text-sm font-semibold hover:text-gray-300 transition-colors">About Us</Link>
        <Link href="/faqs" className="text-sm font-semibold hover:text-gray-300 transition-colors">FAQs</Link>
        <Link href="/blog" className="text-sm font-semibold hover:text-gray-300 transition-colors">Blog</Link>
        <Link href="/contact-us" className="text-sm font-semibold hover:text-gray-300 transition-colors">Contact Us</Link>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-6">
        {/* Search Toggle */}
        <button 
          onClick={() => setIsSearchOpen(!isSearchOpen)} 
          className="hover:text-gray-300 transition-colors flex items-center justify-center"
        >
          {isSearchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
        </button>
        
        {/* Cart Icon with Badge */}
        <Link href="/cart" className="hover:text-gray-300 transition-colors relative flex items-center" onClick={closeSearch}>
          <ShoppingBag size={20} strokeWidth={1.5} />
          {mounted && cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#788E7D] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>

        <Link href="/account" className="hover:text-gray-300 transition-colors" onClick={closeSearch}>
          <User size={20} strokeWidth={1.5} />
        </Link>
      </div>

      {/* Search Overlay Dropdown */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-[#111111] border-b border-[#2A2A2A] shadow-2xl p-6 flex flex-col items-center z-40">
          
          <div className="w-full max-w-2xl relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search for botanicals, collections, or rituals..."
              className="w-full bg-transparent border border-[#2A2A2A] text-white px-12 py-4 outline-none focus:border-[#788E7D] transition-colors text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Autocomplete Results */}
          {searchResults.length > 0 && (
            <div className="w-full max-w-2xl mt-4 flex flex-col gap-2">
              {searchResults.map(product => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-4 p-4 hover:bg-[#1A1A1A] border border-transparent hover:border-[#2A2A2A] transition-colors"
                >
                  {product.featured_image && (
                    <div className="relative w-12 h-12 flex-shrink-0 bg-[#1A1A1A]">
                      <Image 
                        src={product.featured_image} 
                        alt={product.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <h4 className="text-white font-semibold text-sm">{product.name}</h4>
                    <span className="text-gray-500 text-xs uppercase tracking-widest mt-1">
                      {product.category?.split('>').pop() || 'Botanical'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results State */}
          {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
            <p className="text-gray-500 mt-6 text-sm">No rituals found for "{searchQuery}"</p>
          )}

        </div>
      )}
    </nav>
  );
}