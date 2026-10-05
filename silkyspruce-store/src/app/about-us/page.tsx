import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="about-container">
      
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="hero-background">
          <Image 
            src="/products/Cover picture1.jpeg.png" 
            fill 
            className="hero-image" 
            alt="Silky Spruce Products on natural wood" 
            priority
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <p className="hero-subtitle">Our Story</p>
          <h1 className="hero-title">Rooted in Nature</h1>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="story-section">
        <div className="story-layout">
          
          {/* Left: Text Content */}
          <div className="story-text-content">
            <h2 className="story-heading">The heart behind Silky Spruce</h2>
            
            <p className="story-paragraph font-semibold">
              Our story begins with healing. Yours continues with care.
            </p>
            
            <p className="story-paragraph">
              When I was diagnosed with Cutaneous Lupus Erythematosus (CLE), I struggled to find skincare that didn't hurt my skin.
            </p>
            
            <p className="story-paragraph">
              So many products claimed to be "natural," yet they were filled with synthetic fragrances and harsh ingredients that caused more harm than help.
            </p>
            
            <p className="story-paragraph">
              Out of this need, our company, Silky Spruce, was born — a woman-run business built by a mother and daughter team, united by care, resilience, and a shared vision of healing through nature.
            </p>
            
            <p className="story-paragraph">
              Each formula is rooted in nature and shaped by personal experience. We focus on ingredients that nourish sensitive skin, soothe irritation, and bring comfort back to your daily care routine.
            </p>
            
            <p className="story-paragraph">
              Silky Spruce exists for anyone who's ever felt overlooked by mainstream skincare. For those who want clean, thoughtful products made with care.
            </p>
            
            <p className="story-paragraph font-semibold mb-8">
              Every jar is a return to nature. Every bottle is a step toward calm, resilient skin.
            </p>

            <div className="founder-signature">
              <div className="signature-placeholder">
                <span className="italic font-serif text-2xl text-gray-400">Caroline Nkinda</span>
              </div>
            </div>
          </div>

          {/* Right: Supporting Image */}
          <div className="story-image-wrapper">
            <div className="image-frame">
              <Image 
                src="/products/Cover picture1.jpeg.png" 
                fill 
                className="story-image" 
                alt="Silky Spruce Product Collection with botanicals" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* INJECTED CLASSIC CSS */}
      <style>{`
        .about-container {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        /* Hero Section */
        .about-hero {
          position: relative;
          width: 100%;
          height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }
        .hero-image {
          object-fit: cover;
          opacity: 0.6;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(17,17,17,0.3), #111111);
        }
        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 0 1rem;
        }
        .hero-subtitle {
          font-size: 0.875rem;
          letter-spacing: 0.15em;
          color: #ffffff;
          margin-bottom: 1rem;
          text-transform: uppercase;
          font-weight: 600;
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.025em;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 5rem;
          }
        }

        /* Story Section */
        .story-section {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          padding: 6rem 2rem;
        }
        .story-layout {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }
        @media (min-width: 1024px) {
          .story-layout {
            flex-direction: row;
            align-items: center;
            gap: 6rem;
          }
        }

        /* Text Content */
        .story-text-content {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 1024px) {
          .story-text-content {
            width: 55%;
          }
        }
        .story-heading {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 3rem;
          line-height: 1.2;
        }
        .story-paragraph {
          font-size: 1.125rem;
          color: #d1d5db;
          line-height: 1.8;
          margin-bottom: 1.75rem;
        }
        .font-semibold {
          font-weight: 600;
          color: #ffffff;
        }
        .mb-8 {
          margin-bottom: 2rem;
        }

        /* Signature Area */
        .founder-signature {
          margin-top: 1rem;
        }
        .signature-placeholder {
          height: 4rem;
          display: flex;
          align-items: flex-end;
        }

        /* Image Content */
        .story-image-wrapper {
          width: 100%;
        }
        @media (min-width: 1024px) {
          .story-image-wrapper {
            width: 45%;
          }
        }
        .image-frame {
          position: relative;
          aspect-ratio: 4 / 5;
          width: 100%;
          background-color: #1A1A1A;
        }
        .story-image {
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}