import Link from 'next/link';

const HOW_TO_GUIDES = [
  {
    id: 1,
    title: "How to Use Body Oils for Maximum Hydration",
    excerpt: "The secret is in the application - discover the damp-skin method that locks in moisture for 24 hours.",
    slug: "body-oils-hydration",
    image: "/products/Rose water 250ml.jpeg"
  },
  {
    id: 2,
    title: "The Perfect Routine for Sunscreen Cream",
    excerpt: "Lightweight. Non-greasy. Skin-safe defense. Learn how to layer our mineral-based SPF for daily protection.",
    slug: "sunscreen-routine",
    image: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/WhatsAppImage2025-06-05at5.27.21PM_1.jpg?v=1749195340"
  },
  {
    id: 3,
    title: "How to Stimulate Growth with Hair Gel",
    excerpt: "Revive your roots and restore your crown. Our lightweight formula needs the right massage technique to work wonders.",
    slug: "hair-growth-gel",
    image: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/WhatsAppImage2025-07-17at12.29.53PM.jpg?v=1752750512"
  },
  {
    id: 4,
    title: "Refreshing Skin with Original Peppermint Butter",
    excerpt: "Cool. Creamy. Refreshingly smooth. Treat your skin to a breath of fresh air with the right application.",
    slug: "peppermint-whipped-butter",
    image: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/WhippedButter.jpg?v=1746896431"
  }
];

export default function HowToPage() {
  return (
    <div className="guide-container">
      
      {/* EDITORIAL HEADER */}
      <header className="guide-header-creative">
        <p className="guide-kicker">Rituals & Routines</p>
        <h1 className="guide-title">How-To Guides</h1>
        <p className="guide-subtitle">
          Unlock the full potential of your botanicals with our expert application techniques.
        </p>
      </header>

      {/* GUIDE GRID */}
      <div className="guide-grid">
        {HOW_TO_GUIDES.map((guide) => (
          <article key={guide.id} className="guide-card">
            
            <div className="guide-image-wrapper">
              <img 
                src={guide.image} 
                alt={guide.title} 
                className="guide-image"
              />
            </div>
            
            <div className="guide-content">
              <h3 className="guide-card-title">{guide.title}</h3>
              <p className="guide-excerpt">{guide.excerpt}</p>
              
              <Link href={`/how-to-use/${guide.slug}`} className="read-guide-btn">
                VIEW GUIDE
              </Link>
            </div>
            
          </article>
        ))}
      </div>

      <style>{`
        .guide-container {
          width: 100%;
          max-width: 90rem;
          margin: 0 auto;
          padding: 4rem 2rem 8rem;
          display: flex;
          flex-direction: column;
        }

        .guide-header-creative {
          text-align: center;
          margin-bottom: 5rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #2A2A2A;
        }
        
        .guide-kicker {
          font-size: 0.875rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #788E7D;
          margin-bottom: 1.25rem;
          font-weight: 600;
        }
        
        .guide-title {
          font-size: 3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        
        .guide-subtitle {
          font-size: 1.125rem;
          color: #9ca3af;
          max-width: 40rem;
          margin: 0 auto;
          line-height: 1.6;
        }

        @media (min-width: 768px) {
          .guide-title {
            font-size: 4.5rem;
          }
        }

        .guide-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .guide-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .guide-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .guide-card {
          border: 1px solid #2A2A2A;
          display: flex;
          flex-direction: column;
          background-color: transparent;
          min-height: 35rem; 
        }
        
        .guide-image-wrapper {
          width: 100%;
          height: 20rem; 
          overflow: hidden;
          background-color: #1A1A1A;
          border-bottom: 1px solid #2A2A2A;
        }
        
        .guide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }
        
        .guide-card:hover .guide-image {
          transform: scale(1.05);
        }

        .guide-content {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .guide-card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 1.25rem;
          line-height: 1.4;
        }

        .guide-excerpt {
          font-size: 1rem;
          color: #9ca3af;
          margin-bottom: 2.5rem;
          flex-grow: 1; 
          line-height: 1.7;
        }

        .read-guide-btn {
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
        
        .read-guide-btn:hover {
          background-color: #ffffff;
          color: #000000;
        }
      `}</style>
    </div>
  );
}