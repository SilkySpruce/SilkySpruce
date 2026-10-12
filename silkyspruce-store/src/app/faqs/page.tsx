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
        <h1 className="faqs-title">Frequently Asked Questions</h1>
        <p className="faqs-description">
          Do you have questions? We have gathered answers to help you shop with confidence and care. If you cannot find what you are looking for, please reach out to us.
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
            <h2 className="section-title">Orders and Shipping</h2>
          </div>
          <FaqAccordion items={shippingFaqs} />
        </section>

        {/* STILL HAVE QUESTIONS BLOCK */}
        <section className="still-questions-block">
          <h2 className="still-questions-title">Do you still have questions?</h2>
          <p className="still-questions-desc">We would love to hear from you.</p>
          <Link href="/contact-us" className="get-in-touch-link">
            Get in Touch
          </Link>
        </section>

      </div>

      {/* INJECTED CLASSIC CSS */}
      <style>{`
        .faqs-container {
          width: 100%;
          max-width: 64rem;
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
          color: #6b7280;
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