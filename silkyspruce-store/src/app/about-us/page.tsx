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
          <h1 className="hero-title">
            Rooted in <span className="gold-italic">Nature</span>
          </h1>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="story-section">
        <div className="story-layout">
          
          {/* Left: Text Content */}
          <div className="story-text-content">
            <h2 className="story-heading">The Heart Behind Silky Spruce</h2>
            <div className="heading-gold-accent"></div>
            
            <p className="story-paragraph font-semibold">
              Our story begins with healing. Yours continues with care.
            </p>
            
            <p className="story-paragraph">
              When I was diagnosed with Cutaneous Lupus Erythematosus, I struggled to find skincare that did not hurt my skin.
            </p>
            
            <p className="story-paragraph">
              Many products claimed to be natural. However, they were filled with synthetic fragrances and harsh ingredients that caused more harm than good.
            </p>
            
            <p className="story-paragraph">
              Out of this need, our company Silky Spruce was born. We are a business run by women, built by a mother and daughter team. We are united by care, strength, and a shared vision of healing through nature.
            </p>
            
            <p className="story-paragraph">
              Each formula is rooted in nature and shaped by personal experience. We focus on ingredients that nourish sensitive skin, soothe irritation, and bring comfort back to your daily routine.
            </p>
            
            <p className="story-paragraph">
              Silky Spruce exists for anyone who has ever felt overlooked by mainstream skincare. It is for those who want clean and thoughtful products made with care.
            </p>
            
            <p className="story-paragraph font-semibold mb-8">
              Every jar is a return to nature. Every bottle is a step toward calm and healthy skin.
            </p>

            <div className="founder-signature">
              <span className="signature-name">Caroline Nkinda</span>
              <span className="signature-role">Founder, Silky Spruce</span>
            </div>
          </div>

          {/* Right: Supporting Image */}
          <div className="story-image-wrapper">
            <div className="image-frame">
              <Image 
                src="/products/Cover picture1.jpeg.png" 
                fill 
                className="story-image" 
                alt="Silky Spruce Product Collection with plants" 
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
          height: 55vh;
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #2A2A2A;
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
          opacity: 0.45;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(17,17,17,0.35), #111111);
        }
        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 0 1rem;
        }
        .hero-subtitle {
          font-size: 0.8125rem;
          letter-spacing: 0.28em;
          color: #D4AF37;
          margin-bottom: 1rem;
          text-transform: uppercase;
          font-weight: 600;
        }
        .hero-title {
          font-size: 3.25rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.025em;
        }
        .gold-italic {
          color: #D4AF37;
          font-style: italic;
          font-weight: 600;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 4.75rem;
          }
        }

        /* Story Section */
        .story-section {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
          padding: 5rem 2rem 6rem;
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
          font-size: 2.35rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.25rem;
          line-height: 1.2;
        }
        .heading-gold-accent {
          width: 3.5rem;
          height: 2px;
          background-color: #D4AF37;
          margin-bottom: 2.5rem;
        }
        .story-paragraph {
          font-size: 1.0625rem;
          color: #d1d5db;
          line-height: 1.8;
          margin-bottom: 1.65rem;
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
          margin-top: 1.25rem;
          padding-top: 1.5rem;
          border-top: 1px solid #2A2A2A;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .signature-name {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 1.75rem;
          color: #D4AF37;
          letter-spacing: 0.01em;
        }
        .signature-role {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #9ca3af;
          font-weight: 600;
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
          border: 1px solid rgba(212, 175, 55, 0.35);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
        }
        .story-image {
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}