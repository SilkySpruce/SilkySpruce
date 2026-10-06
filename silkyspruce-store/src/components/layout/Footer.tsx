"use client";

import { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions/subscribe';

export default function Footer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleSubscribe = async (formData: FormData) => {
    setIsSubmitting(true);
    setFeedback(null);
    
    const result = await subscribeToNewsletter(formData);
    
    if (result.success) {
      setFeedback({ message: result.message || 'Success!', isError: false });
    } else {
      setFeedback({ message: result.error || 'Something went wrong.', isError: true });
    }
    
    setIsSubmitting(false);
  };

  return (
    <footer className="footer-container">
      
      <div className="footer-content">
        <h4 className="footer-subtitle">
          Join the Ritual
        </h4>
        
        <h2 className="footer-title">
          Silky Spruce Knowledge & Exclusive Offers
        </h2>
        
        <p className="footer-description">
          Get how-to guides, ingredient spotlights, and early access to new collections — straight to your inbox.
        </p>

        {/* Dynamic Subscription Form Area */}
        <div className="form-wrapper">
          {feedback && !feedback.isError ? (
            <div className="success-message">
              {feedback.message}
            </div>
          ) : (
            <form className="subscription-form" action={handleSubscribe}>
              <input 
                type="email" 
                name="email"
                placeholder="your@email.com" 
                className="email-input"
                required
              />
              <button type="submit" className="subscribe-btn" disabled={isSubmitting}>
                {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
              </button>
            </form>
          )}
          
          {feedback?.isError && (
            <p className="error-text">{feedback.message}</p>
          )}
        </div>

        <p className="no-spam-text">
          No spam. Unsubscribe anytime.
        </p>

        {/* WHATSAPP TRIBE LINK */}
        <div className="whatsapp-section">
          <p className="whatsapp-text">Prefer instant updates and exclusive discount drops?</p>
          <a 
            href="https://chat.whatsapp.com/GuOXq6nHqdQG0dFMrzpxkp?s=cl&p=a&mlu=4&ilr=4" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="whatsapp-btn"
          >
            Join the Silky Spruce Tribe on WhatsApp
          </a>
        </div>
      </div>

      <style>{`
        .footer-container {
          width: 100%;
          background-color: #111111;
          padding: 6rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-top: 1px solid #2A2A2A;
        }

        .footer-content {
          max-width: 42rem;
          text-align: center;
          padding: 0 1rem;
          width: 100%;
        }

        .footer-subtitle {
          font-size: 0.625rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .footer-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }
        @media (min-width: 768px) {
          .footer-title {
            font-size: 2.25rem;
          }
        }

        .footer-description {
          color: #d1d5db;
          margin-bottom: 2.5rem;
          font-size: 0.875rem;
        }
        @media (min-width: 768px) {
          .footer-description {
            font-size: 1rem;
          }
        }

        .form-wrapper {
          min-height: 4rem; /* Prevents layout shift when success message appears */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .subscription-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 32rem;
          border-bottom: 1px solid #2A2A2A;
          padding-bottom: 0.5rem;
        }
        @media (min-width: 640px) {
          .subscription-form {
            flex-direction: row;
          }
        }

        .email-input {
          background-color: transparent;
          color: #ffffff;
          width: 100%;
          padding: 0.75rem 1rem;
          outline: none;
          border: none;
        }
        .email-input::placeholder {
          color: #6b7280;
        }

        .subscribe-btn {
          background-color: #788E7D;
          color: #ffffff;
          padding: 0.75rem 2rem;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          white-space: nowrap;
          width: 100%;
          margin-top: 1rem;
        }
        @media (min-width: 640px) {
          .subscribe-btn {
            width: auto;
            margin-top: 0;
          }
        }
        .subscribe-btn:hover:not(:disabled) {
          background-color: #687C6D;
        }
        .subscribe-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .success-message {
          color: #788E7D;
          font-weight: 600;
          font-size: 1.125rem;
          padding: 1rem;
        }

        .error-text {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 1rem;
        }

        .no-spam-text {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .whatsapp-section {
          margin-top: 4rem;
          padding-top: 3rem;
          border-top: 1px solid #2A2A2A;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .whatsapp-text {
          font-size: 0.875rem;
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        .whatsapp-btn {
          display: inline-block;
          background-color: transparent;
          color: #25D366;
          border: 1px solid #25D366;
          padding: 0.75rem 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }
        .whatsapp-btn:hover {
          background-color: #25D366;
          color: #111111;
        }
      `}</style>
    </footer>
  );
}