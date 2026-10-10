import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const GUIDE_CONTENT: Record<string, any> = {
  'body-oils-hydration': {
    title: "How to Use Body Oils for Maximum Hydration",
    coverImage: "/products/Rose water 250ml.jpeg",
    content: (
      <>
        <p>The secret is in the application - discover the damp-skin method that locks in moisture for 24 hours and leaves skin visibly luminous.</p>
        <h3>How to use:</h3>
        <ul>
          <li>✔ Add a few drops to a diffuser for a clean, uplifting atmosphere.</li>
          <li>✔ Blend with carrier oils for an invigorating massage or skincare ritual.</li>
          <li>✔ Mix into DIY sprays, soaps, or cleaners for a fresh touch.</li>
        </ul>
        <p><em>Texture: Smooth, cooling, and absorbs fast.</em></p>
      </>
    )
  },
  'sunscreen-routine': {
    title: "The Perfect Routine for Sunscreen Cream",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/WhatsAppImage2025-06-05at5.27.21PM_1.jpg?v=1749195340",
    content: (
      <>
        <p>Lightweight. Non-greasy. Skin-safe defense. Silky Spruce Sunscreen Cream offers broad-spectrum protection powered by nature. Formulated with mineral-based SPF, nourishing plant oils, and skin-soothing botanicals.</p>
        <h3>How to use:</h3>
        <ul>
          <li>✔ Apply generously 15 minutes before sun exposure</li>
          <li>✔ Reapply every 2 hours or after swimming or sweating</li>
          <li>✔ Use daily—even on cloudy days—for full protection</li>
          <li>✔ Works well as a base under makeup</li>
        </ul>
        <p><em>Texture: Smooth, fast-absorbing, non-comedogenic</em></p>
      </>
    )
  },
  'hair-growth-gel': {
    title: "How to Stimulate Growth with Hair Gel",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/WhatsAppImage2025-07-17at12.29.53PM.jpg?v=1752750512",
    content: (
      <>
        <p>Revive your roots. Restore your crown. Our Silky Spruce Hair Growth Gel is a lightweight, non-greasy formula crafted to stimulate hair growth while nourishing your scalp.</p>
        <h3>How to use:</h3>
        <ul>
          <li>✔ Apply a small amount directly to the scalp and massage gently.</li>
          <li>✔ Use daily or as needed for targeted growth and moisture.</li>
          <li>✔ Best for edges, thinning spots, and protective styles.</li>
        </ul>
        <p><em>Scent: Fresh, herbal, and invigorating. Let your hair thrive naturally.</em></p>
      </>
    )
  },
  'peppermint-whipped-butter': {
    title: "Refreshing Skin with Original Peppermint Butter",
    coverImage: "https://cdn.shopify.com/s/files/1/0680/5579/3708/files/WhippedButter.jpg?v=1746896431",
    content: (
      <>
        <p>Cool. Creamy. Refreshingly smooth. Treat your skin to a breath of fresh air with Silky Spruce Original Peppermint Whipped Body Butter. This rich, airy blend melts on contact.</p>
        <h3>How to use:</h3>
        <ul>
          <li>✔ Apply after showering to lock in moisture</li>
          <li>✔ Use on dry areas like hands, elbows, and feet</li>
          <li>✔ Massage onto tired legs for a cooling effect</li>
          <li>✔ Ideal for daily use—especially in warm weather</li>
        </ul>
        <p><em>Scent: Fresh, minty, and revitalizing.</em></p>
      </>
    )
  }
};

export default async function HowToSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDE_CONTENT[slug];

  if (!guide) {
    notFound();
  }

  return (
    <div className="article-container">
      
      {/* Back Button (Points to How-To hub) */}
      <div className="article-navigation">
        <Link href="/how-to-use" className="back-to-blog">
          <ArrowLeft size={20} /> Back to Guides
        </Link>
      </div>

      <header className="article-header">
        <h1 className="article-title">{guide.title}</h1>
      </header>

      <div className="article-hero-wrapper">
        <img src={guide.coverImage} alt={guide.title} className="article-hero-image" />
      </div>

      <article className="article-body">
        {guide.content}
      </article>

      <style>{`
        .article-container {
          width: 100%;
          max-width: 50rem; 
          margin: 0 auto;
          padding: 4rem 2rem 8rem;
          display: flex;
          flex-direction: column;
        }

        .article-navigation {
          margin-bottom: 3rem;
        }

        .back-to-blog {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: color 0.2s;
        }

        .back-to-blog:hover {
          color: #788E7D;
        }

        .article-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .article-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        @media (min-width: 768px) {
          .article-title {
            font-size: 3.5rem;
          }
        }

        .article-hero-wrapper {
          width: 100%;
          margin-bottom: 4rem;
          overflow: hidden;
          border: 1px solid #2A2A2A;
        }

        .article-hero-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
        }

        .article-body {
          font-size: 1.125rem;
          color: #d1d5db;
          line-height: 1.8;
        }

        .article-body p {
          margin-bottom: 1.5rem;
        }

        .article-body h3 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #ffffff;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #2A2A2A;
          padding-bottom: 0.5rem;
        }

        .article-body ul {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
          list-style: none; /* Hide default bullets, we use custom checkmarks */
        }

        .article-body li {
          margin-bottom: 0.75rem;
        }
        
        .article-body em {
          color: #788E7D;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}