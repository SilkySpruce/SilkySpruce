import Link from 'next/link';
import FaqAccordion from '@/components/ui/FaqAccordion';

const productFaqs = [
  {
    question: "Are your products natural?",
    answer: "Yes. We only use natural and skin loving ingredients. We do not use hidden chemicals, artificial colors, or synthetic preservatives."
  },
  {
    question: "Are your products handmade?",
    answer: "Yes. Every jar, butter, and balm is made by hand in small batches to maintain freshness and quality."
  },
  {
    question: "Can I use Silky Spruce products on my children?",
    answer: "Many of our products are gentle enough for children. For babies or children with sensitive skin, we recommend starting with unscented formulas and testing a small amount on the skin first."
  },
  {
    question: "Are your products safe for sensitive skin or skin conditions like Lupus or eczema?",
    answer: "Yes. All our formulas are created with sensitive skin in mind. We use plant based ingredients that do not irritate the skin. We avoid synthetic fragrances, parabens, and harsh additives."
  },
  {
    question: "How long do your products last?",
    answer: "When stored away from sunlight, they last for 24 months from the date of manufacture. Keep them in a cool and dry place to maintain freshness."
  }
];

const shippingFaqs = [
  {
    question: "How long does delivery take?",
    answer: "Deliveries within Nairobi take 1 to 2 business days. Outside Nairobi, expect your package within 3 to 5 business days."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you will receive a confirmation email with a tracking link. If you did not receive it, please reach out and we will help you track it."
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
        <p className="faqs-subtitle">We Are Here to Help</p>
        <h1 className="faqs-title">
          Frequently Asked <span className="gold-italic">Questions</span>
        </h1>
        <p className="faqs-description">
          Do you have questions? We have gathered answers to help you shop with confidence and care. If you cannot find what you are looking for, please reach out to us.
        </p>
      </div>

      <div className="faqs-layout">
        
        {/* THE PRODUCTS SECTION */}
        <section className="faq-section">
          <div className="section-header">
            <span className="section-kicker">01 • FORMULATIONS & CARE</span>
            <h2 className="section-title">The Products</h2>
          </div>
          <FaqAccordion items={productFaqs} />
        </section>

        {/* ORDERS & SHIPPING SECTION */}
        <section className="faq-section">
          <div className="section-header">
            <span className="section-kicker">02 • DELIVERY & POLICIES</span>
            <h2 className="section-title">Orders and Shipping</h2>
          </div>
          <FaqAccordion items={shippingFaqs} />
        </section>

        {/* STILL HAVE QUESTIONS BLOCK */}
        <section className="still-questions-block">
          <div>
            <p className="still-questions-kicker">NEED PERSONAL ASSISTANCE?</p>
            <h2 className="still-questions-title">Do you still have questions?</h2>
            <p className="still-questions-desc">We would love to hear from you.</p>
          </div>
          <Link href="/contact-us" className="get-in-touch-btn">
            GET IN TOUCH
          </Link>
        </section>

      </div>

      {/* INJECTED CLASSIC CSS */}
      <style>{`
        .faqs-container {
          width: 100%;
          max-width: 64rem;
          margin: 0 auto;
          padding: 5rem 2rem 8rem;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .faqs-header {
          margin-bottom: 4.5rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #2A2A2A;
        }
        .faqs-subtitle {
          font-size: 0.8125rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .faqs-title {
          font-size: 2.75rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        @media (min-width: 768px) {
          .faqs-title {
            font-size: 3.75rem;
          }
        }
        .gold-italic {
          color: #D4AF37;
          font-style: italic;
          font-weight: 600;
        }
        .faqs-description {
          font-size: 1.125rem;
          color: #9ca3af;
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
          border-bottom: 1px solid rgba(212, 175, 55, 0.45);
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .section-kicker {
          font-size: 0.6875rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #D4AF37;
          font-weight: 600;
        }
        .section-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #ffffff;
        }

        /* Still Have Questions */
        .still-questions-block {
          margin-top: 1rem;
          padding: 2.5rem;
          border: 1px solid rgba(212, 175, 55, 0.35);
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(20, 20, 20, 0.95) 100%);
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          align-items: flex-start;
        }
        @media (min-width: 768px) {
          .still-questions-block {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 3rem;
          }
        }
        .still-questions-kicker {
          font-size: 0.6875rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #D4AF37;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .still-questions-title {
          font-size: 1.625rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.35rem;
        }
        .still-questions-desc {
          font-size: 1rem;
          color: #9ca3af;
        }
        .get-in-touch-btn {
          display: inline-block;
          background-color: #D4AF37;
          color: #111111;
          text-decoration: none;
          padding: 1rem 2rem;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          white-space: nowrap;
          transition: background-color 0.2s ease;
        }
        .get-in-touch-btn:hover {
          background-color: #E5C158;
        }
      `}</style>
    </div>
  );
}