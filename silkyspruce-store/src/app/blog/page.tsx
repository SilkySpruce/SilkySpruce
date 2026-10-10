// src/app/blog/page.tsx
import Link from 'next/link';

const BLOG_POSTS = [
  {
    id: 1,
    date: "APRIL 17, 2026",
    title: "The Power of the Rose: Why Our Anti-Aging Glow Oil is a Fan Favorite",
    excerpt: "There’s a reason the Silky Spruce Anti-Aging glow oil has become the most-loved product in the Silky Spruce collection. It isn't just about hydration; it’s about the legendary benefits of the Rose essential oil.",
    slug: "the-power-of-the-rose",
    image: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/AntiAgingGlowOil1.jpg?v=1746893646"
  },
  {
    id: 2,
    date: "APRIL 10, 2026",
    title: "Best Body Butter for Eczema in Kenya (What Actually Works)",
    excerpt: "If you’ve ever dealt with eczema, then you already know… it’s not just “dry skin.” It’s the itching. The flare-ups that come out of nowhere. The frustration of trying product after product and still not getting relief.",
    slug: "best-body-butter-eczema-kenya",
    image: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/WhippedButterVanilla.jpg?v=1746896431"
  },
  {
    id: 3,
    date: "NOVEMBER 22, 2025",
    title: "Silky Spruce Bebe Balm: The Natural Solution for Dry, Sensitive Skin",
    excerpt: "Dry skin can be uncomfortable — especially when it shows up on babies, people with sensitive skin conditions, or anyone living in harsh weather. At Silky Spruce, we believe in healing skin with love and nature.",
    slug: "bebe-balm-natural-solution",
    image: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/BebeBalm.jpg?v=1747777466"
  },
  {
    id: 4,
    date: "OCTOBER 28, 2025",
    title: "Hair Grows Naturally — No Oil Can Grow Your Hair",
    excerpt: "Let’s be honest, no oil can create hair growth out of nothing. Hair grows naturally, from within. It’s a process fueled by healthy scalp circulation, nutrition, and consistent care — not quick fixes or miracle claims.",
    slug: "hair-grows-naturally",
    image: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/HairGrowthStimulator.jpg?v=1746892625"
  },
  {
    id: 5,
    date: "MAY 20, 2025",
    title: "How to Treat Dry Skin Naturally: Top Plant-Based Remedies",
    excerpt: "Dry skin doesn’t ask for much. It just wants to be heard. When it tightens, flakes, itches—that’s not a flaw. It’s a signal. A quiet way of saying, “Something’s missing.”",
    slug: "treat-dry-skin-naturally",
    image: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/CoconutButterLotion.jpg?v=1747662755"
  },
  {
    id: 6,
    date: "MAY 20, 2025",
    title: "Why Your Skin Loves Shea Butter (And How to Use It Daily)",
    excerpt: "Some ingredients come and go. Shea butter stays. It’s not a trend. It’s a staple used for generations to soften skin, soothe irritation, and lock in moisture without the fuss.",
    slug: "why-skin-loves-shea-butter",
    image: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/NiloticSheaButter.jpg?v=1747764559"
  }
];

export default function BlogPage() {
  return (
    <div className="blog-container">
      
      {/* REDESIGNED EDITORIAL HEADER */}
      <header className="blog-header-creative">
        <p className="blog-kicker">The Silky Spruce Journal</p>
        <h1 className="blog-title">Nature's Finest</h1>
        <p className="blog-subtitle">
          Insights, rituals, and plant-based remedies for your everyday glow.
        </p>
      </header>

      {/* BLOG GRID */}
      <div className="blog-grid">
        {BLOG_POSTS.map((post) => (
          <article key={post.id} className="blog-card">
            
            <div className="blog-image-wrapper">
              <img 
                src={post.image} 
                alt={post.title} 
                className="blog-image"
              />
            </div>
            
            <div className="blog-content">
              <p className="blog-date">{post.date}</p>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              
              <Link href={`/blog/${post.slug}`} className="read-article-btn">
                READ ARTICLE
              </Link>
            </div>
            
          </article>
        ))}
      </div>

      <style>{`
        .blog-container {
          width: 100%;
          max-width: 90rem;
          margin: 0 auto;
          padding: 4rem 2rem 8rem;
          display: flex;
          flex-direction: column;
        }

        /* Redesigned Header */
        .blog-header-creative {
          text-align: center;
          margin-bottom: 5rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #2A2A2A;
        }
        
        .blog-kicker {
          font-size: 0.875rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #788E7D;
          margin-bottom: 1.25rem;
          font-weight: 600;
        }
        
        .blog-title {
          font-size: 3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        
        .blog-subtitle {
          font-size: 1.125rem;
          color: #9ca3af;
          max-width: 40rem;
          margin: 0 auto;
          line-height: 1.6;
        }

        @media (min-width: 768px) {
          .blog-title {
            font-size: 4.5rem;
          }
          .blog-subtitle {
            font-size: 1.25rem;
          }
        }

        /* Grid Setup */
        .blog-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Card Styling */
        .blog-card {
          border: 1px solid #2A2A2A;
          display: flex;
          flex-direction: column;
          background-color: transparent;
          min-height: 35rem; 
        }
        
        .blog-image-wrapper {
          width: 100%;
          height: 20rem; 
          overflow: hidden;
          background-color: #1A1A1A;
          border-bottom: 1px solid #2A2A2A;
        }
        
        .blog-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }
        
        .blog-card:hover .blog-image {
          transform: scale(1.05);
        }

        .blog-content {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .blog-date {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .blog-card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 1.25rem;
          line-height: 1.4;
        }

        .blog-excerpt {
          font-size: 1rem;
          color: #9ca3af;
          margin-bottom: 2.5rem;
          flex-grow: 1; 
          line-height: 1.7;
        }

        .read-article-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 1rem;
          background-color: transparent;
          border: 1px solid #ffffff;
          color: #ffffff;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }
        
        .read-article-btn:hover {
          background-color: #ffffff;
          color: #000000;
        }
      `}</style>
    </div>
  );
}