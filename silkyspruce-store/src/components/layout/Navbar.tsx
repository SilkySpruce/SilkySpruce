"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, X, Home as HomeIcon, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/lib/supabase';

const NAV_LINKS = [
  { href: '/', label: 'Home', isHome: true },
  { href: '/shop', label: 'Collection' },
  { href: '/about-us', label: 'About Us' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/how-to-use', label: 'How To Use' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact-us', label: 'Contact Us' },
];

export default function Navbar() {
  const pathname = usePathname();
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

  const isActiveTab = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isAdmin = mounted && isAuthenticated && user?.email === 'fountaincreations@gmail.com';

  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-[#111111] border-b border-[#2A2A2A]">
        {/* Top Navigation Row */}
        <nav className="w-full px-6 md:px-8 py-4 flex items-center justify-between">
          {/* Logo & Mobile Menu Hamburger */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              className="md:hidden text-white hover:text-[#D4AF37] transition-colors flex items-center justify-center"
              onClick={() => {
                setIsMobileMenuOpen(true);
                closeSearch();
              }}
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>

            <Link href="/" onClick={closeSearch} className="flex items-center">
              <Image
                src="/products/Silky Logo.png"
                alt="Silky Spruce Logo"
                width={110}
                height={36}
                className="object-contain w-20 md:w-28 h-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const active = isActiveTab(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-1 text-sm font-semibold transition-colors flex items-center gap-1.5 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#D4AF37] after:transition-all after:duration-200 ${
                    active
                      ? 'text-[#D4AF37] after:w-full'
                      : 'text-white hover:text-[#D4AF37] after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.isHome && <HomeIcon size={16} strokeWidth={1.5} />}
                  {link.label}
                </Link>
              );
            })}

            {/* Dynamic Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                aria-current={isActiveTab('/admin') ? 'page' : undefined}
                className={`text-sm font-semibold transition-colors border px-3 py-1 rounded ${
                  isActiveTab('/admin')
                    ? 'bg-[#D4AF37] text-[#111111] border-[#D4AF37]'
                    : 'text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Icons (Search, Cart, User) */}
          <div className="flex items-center space-x-5 md:space-x-6">
            <button
              onClick={() => (isSearchOpen ? closeSearch() : setIsSearchOpen(true))}
              className={`transition-colors flex items-center justify-center ${
                isSearchOpen ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
              }`}
              aria-label="Search"
            >
              {isSearchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </button>

            <Link
              href="/cart"
              aria-current={isActiveTab('/cart') ? 'page' : undefined}
              className={`transition-colors relative flex items-center ${
                isActiveTab('/cart') ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
              }`}
              onClick={closeSearch}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-[#111111] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              aria-current={isActiveTab('/account') ? 'page' : undefined}
              className={`transition-colors ${
                isActiveTab('/account') ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
              }`}
              onClick={closeSearch}
            >
              <User size={20} strokeWidth={1.5} />
            </Link>
          </div>
        </nav>

        {/* Inline Search Bar (pushes page content down instead of overlapping it) */}
        {isSearchOpen && (
          <div className="relative w-full bg-[#111111] border-t border-[#2A2A2A] px-6 py-4 flex flex-col items-center">
            <div className="w-full max-w-2xl relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search for products or collections..."
                className="w-full bg-[#141414] border border-[#2A2A2A] text-white pl-11 pr-10 py-3 outline-none focus:border-[#D4AF37] transition-colors text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchQuery.trim().length >= 2 && (
              <div className="w-full max-w-2xl mt-3 bg-[#141414] border border-[#2A2A2A] shadow-2xl">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col divide-y divide-[#2A2A2A]">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-4 p-3.5 hover:bg-[#1A1A1A] transition-colors"
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
                          <span className="text-[#D4AF37] text-xs uppercase tracking-widest mt-1">
                            {product.category?.split('>').pop() || 'Product'}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 p-4 text-center text-sm">
                    No products found for &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* MOBILE FULL-SCREEN MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#111111] flex flex-col px-8 py-6 md:hidden">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-6 mb-8">
            <Image
              src="/products/Silky Logo.png"
              alt="Silky Spruce Logo"
              width={100}
              height={32}
              className="object-contain w-24 h-auto"
            />
            <button
              onClick={closeMobileMenu}
              className="text-white hover:text-[#D4AF37] transition-colors"
              aria-label="Close menu"
            >
              <X size={28} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-col space-y-6 overflow-y-auto pb-8 flex-grow">
            {NAV_LINKS.map((link) => {
              const active = isActiveTab(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  aria-current={active ? 'page' : undefined}
                  className={`text-lg transition-colors ${
                    active
                      ? 'font-semibold text-[#D4AF37] border-l-2 border-[#D4AF37] pl-3'
                      : 'font-medium text-white hover:text-[#D4AF37]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={closeMobileMenu}
                aria-current={isActiveTab('/admin') ? 'page' : undefined}
                className="text-lg font-semibold text-[#D4AF37] mt-4 pt-4 border-t border-[#2A2A2A]"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Footer Contact Info */}
          <div className="border-t border-[#2A2A2A] pt-6 mt-auto">
            <p className="text-xs text-[#D4AF37] uppercase tracking-widest mb-2 font-semibold">Get in touch</p>
            <a href="mailto:fountaincreations@gmail.com" className="text-sm text-white hover:text-[#D4AF37] block mb-1">
              fountaincreations@gmail.com
            </a>
            <a href="tel:+254757225004" className="text-sm text-white hover:text-[#D4AF37] block">
              +254 757 225 004
            </a>
          </div>
        </div>
      )}
    </>
  );
}