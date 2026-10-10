"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, X, Home as HomeIcon, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const { items } = useCartStore();
  const { user, isAuthenticated } = useUserStore();
  const [mounted, setMounted] = useState(false);
  
  // UI States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  useEffect(() => {
    setMounted(true);
    
    // Prevent scrolling when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Debounced Supabase Search
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, featured_image, category')
        .or(`name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(5); 
        
      if (data) setSearchResults(data);
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isAdmin = mounted && isAuthenticated && user?.email === 'fountaincreations@gmail.com';

  return (
    <>
      <nav className="w-full border-b border-[#2A2A2A] bg-[#111111] px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        
        {/* Logo & Mobile Menu Hamburger */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button 
            className="md:hidden text-white hover:text-[#788E7D] transition-colors flex items-center justify-center"
            onClick={() => {
              setIsMobileMenuOpen(true);
              closeSearch();
            }}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          
          <Link href="/" onClick={closeSearch}>
            <Image 
              src="/products/Silky Logo.png" 
              alt="Silky Spruce Logo" 
              width={110} 
              height={36} 
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-semibold hover:text-gray-300 transition-colors flex items-center gap-1.5">
            <HomeIcon size={16} strokeWidth={1.5} /> Home
          </Link>
          <Link href="/shop" className="text-sm font-semibold hover:text-gray-300 transition-colors">Collection</Link>
          <Link href="/about-us" className="text-sm font-semibold hover:text-gray-300 transition-colors">About Us</Link>
          <Link href="/faqs" className="text-sm font-semibold hover:text-gray-300 transition-colors">FAQs</Link>
          <Link href="/how-to-use" className="text-sm font-semibold hover:text-gray-300 transition-colors">How To Use</Link>
          <Link href="/blog" className="text-sm font-semibold hover:text-gray-300 transition-colors">Blog</Link>
          <Link href="/contact-us" className="text-sm font-semibold hover:text-gray-300 transition-colors">Contact Us</Link>
          
          {/* Dynamic Admin Link */}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-semibold text-[#788E7D] hover:text-[#687C6D] transition-colors border border-[#788E7D] px-3 py-1 rounded">
              Admin
            </Link>
          )}
        </div>

        {/* Right Icons (Search, Cart, User) */}
        <div className="flex items-center space-x-5 md:space-x-6">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            className="hover:text-gray-300 transition-colors flex items-center justify-center"
          >
            {isSearchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
          </button>
          
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

            {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <p className="text-gray-500 mt-6 text-sm">No rituals found for "{searchQuery}"</p>
            )}

          </div>
        )}
      </nav>

      {/* MOBILE FULL-SCREEN MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#111111] flex flex-col px-8 py-6 md:hidden">
          
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-6 mb-8">
            <Image 
              src="/products/Silky Logo.png" 
              alt="Silky Spruce Logo" 
              width={120} 
              height={40} 
              className="object-contain"
            />
            <button 
              onClick={closeMobileMenu}
              className="text-white hover:text-[#788E7D] transition-colors"
            >
              <X size={28} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-col space-y-8 overflow-y-auto pb-20">
            <Link href="/" onClick={closeMobileMenu} className="text-2xl font-semibold text-white hover:text-[#788E7D] transition-colors">
              Home
            </Link>
            <Link href="/shop" onClick={closeMobileMenu} className="text-2xl font-semibold text-white hover:text-[#788E7D] transition-colors">
              Collection
            </Link>
            <Link href="/about-us" onClick={closeMobileMenu} className="text-2xl font-semibold text-white hover:text-[#788E7D] transition-colors">
              About Us
            </Link>
            <Link href="/faqs" onClick={closeMobileMenu} className="text-2xl font-semibold text-white hover:text-[#788E7D] transition-colors">
              FAQs
            </Link>
            <Link href="/how-to-use" onClick={closeMobileMenu} className="text-2xl font-semibold text-white hover:text-[#788E7D] transition-colors">
              How To Use
            </Link>
            <Link href="/blog" onClick={closeMobileMenu} className="text-2xl font-semibold text-white hover:text-[#788E7D] transition-colors">
              Blog
            </Link>
            <Link href="/contact-us" onClick={closeMobileMenu} className="text-2xl font-semibold text-white hover:text-[#788E7D] transition-colors">
              Contact Us
            </Link>
            
            {isAdmin && (
              <Link href="/admin" onClick={closeMobileMenu} className="text-2xl font-semibold text-[#788E7D] mt-4">
                Admin Dashboard
              </Link>
            )}
          </div>
          
        </div>
      )}
    </>
  );
}