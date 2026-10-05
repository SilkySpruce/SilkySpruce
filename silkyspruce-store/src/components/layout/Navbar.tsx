import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-[#2A2A2A] bg-[#111111] px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      
      {/* Logo */}
      <Link href="/" className="flex-shrink-0">
        <Image 
          src="/products/Silky Spruce Logo.png" 
          alt="Silky Spruce Logo" 
          width={120} 
          height={40} 
          className="object-contain"
        />
      </Link>

      {/* Center Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/shop" className="text-sm font-semibold hover:text-gray-300 transition-colors">Shop All</Link>
        <Link href="/about-us" className="text-sm font-semibold hover:text-gray-300 transition-colors">About Us</Link>
        <Link href="/faqs" className="text-sm font-semibold hover:text-gray-300 transition-colors">FAQs</Link>
        <Link href="/blog" className="text-sm font-semibold hover:text-gray-300 transition-colors">Blog</Link>
        <Link href="/contact-us" className="text-sm font-semibold hover:text-gray-300 transition-colors">Contact Us</Link>
      </div>

      {/* Right Icons */}
      <div className="flex items-center space-x-6">
        <button className="hover:text-gray-300 transition-colors">
          <Search size={20} strokeWidth={1.5} />
        </button>
        <Link href="/cart" className="hover:text-gray-300 transition-colors relative">
          <ShoppingBag size={20} strokeWidth={1.5} />
          {/* Optional: Add a notification dot here later when cart state is connected */}
        </Link>
        <Link href="/account" className="hover:text-gray-300 transition-colors">
          <User size={20} strokeWidth={1.5} />
        </Link>
      </div>

    </nav>
  );
}