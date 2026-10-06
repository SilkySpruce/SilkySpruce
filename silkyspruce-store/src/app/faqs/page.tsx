import Link from 'next/link';
import FaqAccordion from '@/components/ui/FaqAccordion';

const productFaqs = [
  {
    question: "Are your products natural?",
    answer: "Yes. We only use natural, skin-loving ingredients. No hidden chemicals, no artificial colors, no synthetic preservatives."
  },
  {
    question: "Are your products handmade?",
    answer: "Absolutely. Every jar, butter, and balm is handcrafted in small batches to maintain freshness, potency, and quality."
  },
  {
    question: "Can I use Silky Spruce products on my children?",
    answer: "Many of our products are gentle enough for children. For babies or sensitive little ones, we recommend starting with unscented formulas and patch-testing first."
  },
  {
    question: "Are your products safe for sensitive skin or skin conditions like Lupus or eczema?",
    answer: "Yes. All our formulas are created with sensitive skin in mind using plant-based, non-irritating ingredients and avoiding synthetic fragrances, parabens, and harsh additives."
  },
  {
    question: "How long do your products last?",
    answer: "Stored away from sunlight they last for 24 months from date of manufacture. Keep them in a cool, dry place to maintain freshness."
  }
];

const shippingFaqs = [
  {
    question: "How long does delivery take?",
    answer: "Deliveries within Nairobi take 1-2 business days. Outside Nairobi, expect your package within 3-5 business days."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you'll receive a confirmation email with a tracking link. Didn't get it? Reach out and we'll help you track it down."
  },
  {
    question: "What is your return policy?",
    answer: "Due to the nature of our personal care products, we do not accept returns. If your product arrives damaged, please contact us within 48 hours for a replacement."
  }
];

export default function FaqsPage() {
  return (
    <div className="faqs-container">
      
      {/* PAGE HEADER */}
      <div className="faqs-header">
        <p className="faqs-subtitle">We're Here to Help</p>
        <h1 className="faqs-title">Frequently Asked Questions</h1>
        <p className="faqs-description">
          Got questions? We've gathered answers to help you shop with confidence and care. Can't find what you're looking for? Reach out to us.
        </p>
      </div>

      <div className="faqs-layout">
        
        {/* THE PRODUCTS SECTION */}
        <section className="faq-section">
          <div className="section-header">
            <h2 className="section-title">The Products</h2>
          </div>
          <FaqAccordion items={productFaqs} />
        </section>

        {/* ORDERS & SHIPPING SECTION */}
        <section className="faq-section">
          <div className="section-header">
            <h2 className="section-title">Orders & Shipping</h2>
          </div>
          <FaqAccordion items={shippingFaqs} />
        </section>

        {/* STILL HAVE QUESTIONS BLOCK */}
        <section className="still-questions-block">
          <h2 className="still-questions-title">Still have questions?</h2>
          <p className="still-questions-desc">We'd love to hear from you.</p>
          <Link href="/contact-us" className="get-in-touch-link">
            Get in Touch
          </Link>
        </section>

      </div>

      {/* INJECTED CLASSIC CSS */}
      <style>{`
        .faqs-container {
          width: 100%;
          max-width: 64rem; /* Centered narrow column for readability */
          margin: 0 auto;
          padding: 6rem 2rem 8rem;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .faqs-header {
          margin-bottom: 4rem;
        }
        .faqs-subtitle {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .faqs-title {
          font-size: 3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 768px) {
          .faqs-title {
            font-size: 3.5rem;
          }
        }
        .faqs-description {
          font-size: 1.125rem;
          color: #6b7280; /* Gray-500 equivalent */
          line-height: 1.6;
          max-width: 48rem;
        }

        /* Sections */
        .faqs-layout {
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }
        .faq-section {
          width: 100%;
        }
        .section-header {
          border-bottom: 2px solid #ffffff;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        .section-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #ffffff;
        }

        /* Still Have Questions */
        .still-questions-block {
          margin-top: 2rem;
        }
        .still-questions-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        .still-questions-desc {
          font-size: 1.125rem;
          color: #6b7280;
          margin-bottom: 2rem;
        }
        .get-in-touch-link {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          text-decoration: none;
          border-bottom: 1px solid #ffffff;
          padding-bottom: 0.25rem;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .get-in-touch-link:hover {
          color: #9ca3af;
          border-color: #9ca3af;
        }
      `}</style>
    </div>
  );
}