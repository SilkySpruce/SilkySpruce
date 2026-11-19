"use client";

import { useState } from 'react';
import { sendContactEmail } from '@/app/actions/sendEmail';

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Call the server action directly
    const result = await sendContactEmail(formData);
    
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrorMessage(result.error || 'Something went wrong. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="contact-container">
      
      <div className="contact-header">
        <p className="contact-subtitle">Get in Touch</p>
        <h1 className="contact-title">
          Connect <span className="gold-italic">With Us</span>
        </h1>
        <p className="contact-description">
          Whether you have a question about a specific plant based ingredient, require assistance with your daily routine, or simply wish to say hello, we are always here for you.
        </p>
      </div>

      <div className="contact-layout">
        
        {/* LEFT COLUMN: INFO */}
        <div className="contact-info">
          <div className="info-block">
            <h3 className="info-heading">Store</h3>
            <p className="info-text">Tom Mboya Street, Platinum Plaza, 3rd floor shop 305, CBD, Nairobi, Kenya</p>
          </div>

          <div className="info-block">
            <h3 className="info-heading">Hours</h3>
            <div className="hours-list">
              <div className="hours-row">
                <span className="hours-label">Store Open Hours</span>
                <span className="hours-value">9:30 AM – 6:30 PM</span>
              </div>
              <div className="hours-row">
                <span className="hours-label">Delivery Hours</span>
                <span className="hours-value">9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>

          <div className="info-block">
            <h3 className="info-heading">Reach Out</h3>
            <a href="mailto:fountaincreations@gmail.com" className="info-link">fountaincreations@gmail.com</a>
            <a href="tel:+254757225004" className="info-link">+254 757 225 004</a>
          </div>

          <div className="info-block">
            <h3 className="info-heading">Follow Us</h3>
            <a href="https://www.instagram.com/silky_spruce/" target="_blank" rel="noopener noreferrer" className="info-link">Instagram</a>
            <a href="https://www.facebook.com/silkyspruce" target="_blank" rel="noopener noreferrer" className="info-link">Facebook</a>
            <a href="https://www.tiktok.com/@silky_spruce" target="_blank" rel="noopener noreferrer" className="info-link">TikTok</a>
            <a 
              href="https://chat.whatsapp.com/GuOXq6nHqdQG0dFMrzpxkp?s=cl&p=a&mlu=4&ilr=4" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="tribe-link"
            >
              Join the Silky Spruce Tribe
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="contact-form-wrapper">
          {isSubmitted ? (
            <div className="success-message">
              <p className="success-kicker">MESSAGE RECEIVED</p>
              <h3>Thank you for reaching out!</h3>
              <p>Your message has been sent. We will get back to you shortly.</p>
              <button className="reset-button" onClick={() => setIsSubmitted(false)}>
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form className="contact-form" action={handleFormAction}>
              
              {errorMessage && (
                <div className="text-red-500 mb-4 text-sm font-semibold">{errorMessage}</div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" name="firstName" required />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" name="lastName" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={6} required></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>

            </form>
          )}
        </div>

      </div>

      {/* INJECTED CLASSIC CSS */}
      <style>{`
        .contact-container {
          width: 100%;
          max-width: 72rem;
          margin: 0 auto;
          padding: 4rem 2rem 8rem;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .contact-header {
          text-align: center;
          margin-bottom: 5rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #2A2A2A;
        }
        .contact-subtitle {
          font-size: 0.8125rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .contact-title {
          font-size: 3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        @media (min-width: 768px) {
          .contact-title {
            font-size: 4rem;
          }
        }
        .gold-italic {
          color: #D4AF37;
          font-style: italic;
          font-weight: 600;
        }
        .contact-description {
          font-size: 1.125rem;
          color: #9ca3af;
          line-height: 1.6;
          max-width: 42rem;
          margin: 0 auto;
        }

        /* Layout */
        .contact-layout {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }
        @media (min-width: 1024px) {
          .contact-layout {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
        }

        /* Left Column: Info */
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2.75rem;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .contact-info {
            width: 32%;
          }
        }
        .info-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .info-heading {
          font-size: 1.35rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 1.125rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #2A2A2A;
          width: 100%;
        }
        .info-text {
          font-size: 1rem;
          color: #d1d5db;
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }

        /* Hours List */
        .hours-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          width: 100%;
        }
        .hours-row {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .hours-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #D4AF37;
          font-weight: 600;
        }
        .hours-value {
          font-size: 1rem;
          color: #ffffff;
          font-weight: 500;
        }

        .info-link {
          font-size: 1rem;
          color: #ffffff;
          text-decoration: none;
          border-bottom: 1px solid #2A2A2A;
          padding-bottom: 0.25rem;
          margin-bottom: 0.875rem;
          font-weight: 600;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .info-link:hover {
          color: #D4AF37;
          border-color: #D4AF37;
        }
        .tribe-link {
          display: inline-block;
          margin-top: 0.75rem;
          padding: 0.65rem 1.125rem;
          border: 1px solid #D4AF37;
          color: #D4AF37;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }
        .tribe-link:hover {
          background-color: #D4AF37;
          color: #111111;
        }

        /* Right Column: Form */
        .contact-form-wrapper {
          width: 100%;
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 2.5rem;
          background-color: #141414;
        }
        @media (min-width: 768px) {
          .contact-form-wrapper {
            padding: 3rem;
          }
        }
        @media (min-width: 1024px) {
          .contact-form-wrapper {
            width: 60%;
          }
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .form-row {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .form-row {
            flex-direction: row;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .form-group label {
          font-size: 0.6875rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          background-color: #111111;
          border: 1px solid #2A2A2A;
          padding: 1rem;
          color: #ffffff;
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #D4AF37;
        }
        .form-group textarea {
          resize: vertical;
        }
        .submit-button {
          width: 100%;
          background-color: #D4AF37;
          color: #111111;
          border: none;
          padding: 1.25rem;
          font-size: 0.9375rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .submit-button:hover:not(:disabled) {
          background-color: #E5C158;
        }
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Success Message */
        .success-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          min-height: 20rem;
        }
        .success-kicker {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #D4AF37;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .success-message h3 {
          font-size: 1.5rem;
          color: #ffffff;
          margin-bottom: 1rem;
        }
        .success-message p {
          color: #9ca3af;
          margin-bottom: 2rem;
        }
        .reset-button {
          background-color: transparent;
          border: 1px solid #D4AF37;
          color: #D4AF37;
          padding: 0.85rem 2rem;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .reset-button:hover {
          background-color: #D4AF37;
          color: #111111;
        }
      `}</style>
    </div>
  );
}