// src/app/shop/[slug]/page.tsx
import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductClient from './ProductClient';

// 1. Generate SEO Metadata for WhatsApp/Google
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params; 

  // FIXED: Querying correct column names from the database
  const { data: products } = await supabase
    .from('products')
    .select('name, short_description, long_description, featured_image')
    .eq('slug', slug)
    .limit(1);

  const product = products?.[0];

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const previousImages = (await parent).openGraph?.images || [];
  
  // Use short_description for the SEO preview, fallback to long_description
  const baseDescription = product.short_description || product.long_description || 'Discover our botanical skincare collection.';
  const cleanDescription = baseDescription.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';

  return {
    title: product.name,
    description: cleanDescription,
    openGraph: {
      title: product.name,
      description: cleanDescription,
      url: `https://silkyspruce.co.ke/shop/${slug}`, // <-- Use the unwrapped slug
      images: [
        {
          url: product.featured_image || previousImages[0], 
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

// 2. The Server Component Wrapper
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; 
  
  // Pass the safely unwrapped slug down to the interactive client component
  return <ProductClient slug={slug} />;
}