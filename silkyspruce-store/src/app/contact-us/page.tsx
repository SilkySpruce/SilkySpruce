"use client";

import { useState } from 'react';

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="contact-container">
      
      {/* PAGE HEADER */}
      <div className="contact-header">
        <p className="contact-subtitle">Get in Touch</p>
        <h1 className="contact-title">Let's Connect</h1>
        <p className="contact-description">
          Whether you have a question about a specific plant-based ingredient, need help with your daily routine, or just want to say hello — we're always here for you.
        </p>
      </div>

      <div className="contact-layout">
        
        {/* LEFT COLUMN: INFO */}
        <div className="contact-info">
          
          <div className="info-block">
            <h3 className="info-heading">Store</h3>
            <p className="info-text">Nairobi, Kenya</p>
          </div>

          <div className="info-block">
            <h3 className="info-heading">Reach Out</h3>
            <a href="mailto:info@silkyspruce.co.ke" className="info-link">info@silkyspruce.co.ke</a>
            <a href="tel:+254757225004" className="info-link">+254 757 225 004</a>
          </div>

          <div className="info-block">
            <h3 className="info-heading">Follow Us</h3>
            <a href="#" className="info-link">Instagram</a>
            <a href="#" className="info-link">Facebook</a>
            <a href="#" className="info-link">TikTok</a>
          </div>

        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="contact-form-wrapper">
          {isSubmitted ? (
            <div className="success-message">
              <h3>Thank you for reaching out!</h3>
              <p>Your message has been sent. We will get back to you shortly.</p>
              <button className="reset-button" onClick={() => setIsSubmitted(false)}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" required />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows={6} required></textarea>
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
        }
        .contact-subtitle {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #ffffff;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .contact-title {
          font-size: 3.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }
        .contact-description {
          font-size: 1.125rem;
          color: #6b7280;
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
          gap: 3rem;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .contact-info {
            width: 30%;
          }
        }
        .info-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .info-heading {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }
        .info-text {
          font-size: 1rem;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        .info-link {
          font-size: 1rem;
          color: #ffffff;
          text-decoration: none;
          border-bottom: 1px solid #ffffff;
          padding-bottom: 0.25rem;
          margin-bottom: 1rem;
          font-weight: 600;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .info-link:hover {
          color: #9ca3af;
          border-color: #9ca3af;
        }

        /* Right Column: Form */
        .contact-form-wrapper {
          width: 100%;
          border: 1px solid #2A2A2A;
          padding: 3rem;
          background-color: transparent;
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
          font-size: 0.625rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          background-color: transparent;
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
          border-color: #788E7D;
        }
        .form-group textarea {
          resize: vertical;
        }
        .submit-button {
          width: 100%;
          background-color: #788E7D;
          color: #ffffff;
          border: none;
          padding: 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .submit-button:hover:not(:disabled) {
          background-color: #687C6D;
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
          border: 1px solid #ffffff;
          color: #ffffff;
          padding: 0.75rem 2rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .reset-button:hover {
          background-color: #ffffff;
          color: #000000;
        }
      `}</style>
    </div>
  );
}