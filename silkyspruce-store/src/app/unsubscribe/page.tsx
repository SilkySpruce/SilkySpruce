"use client";

import { useState } from 'react';
import Link from 'next/link';
import { unsubscribeFromNewsletter } from '@/app/actions/unsubscribe';

export default function UnsubscribePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleUnsubscribe = async (formData: FormData) => {
    setIsSubmitting(true);
    setFeedback(null);
    
    const result = await unsubscribeFromNewsletter(formData);
    
    if (result.success) {
      setFeedback({ message: result.message || 'Success!', isError: false });
    } else {
      setFeedback({ message: result.error || 'Something went wrong.', isError: true });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="unsubscribe-container">
      <div className="unsubscribe-card">
        <h1 className="unsubscribe-title">Unsubscribe</h1>
        
        {feedback && !feedback.isError ? (
          <div className="success-state">
            <p className="success-message">{feedback.message}</p>
            <p className="success-subtext">We're sorry to see you go. You will no longer receive marketing emails from us.</p>
            <Link href="/" className="return-home-btn">Return to Homepage</Link>
          </div>
        ) : (
          <>
            <p className="unsubscribe-description">
              Enter your email address below to stop receiving updates, guides, and exclusive offers from the Silky Spruce Tribe.
            </p>

            <form className="unsubscribe-form" action={handleUnsubscribe}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="your@email.com" 
                  required 
                />
              </div>
              
              <button type="submit" className="unsubscribe-btn" disabled={isSubmitting}>
                {isSubmitting ? 'REMOVING...' : 'UNSUBSCRIBE'}
              </button>
            </form>

            {feedback?.isError && (
              <p className="error-message">{feedback.message}</p>
            )}
          </>
        )}
      </div>

      <style>{`
        .unsubscribe-container {
          width: 100%;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
        }
        .unsubscribe-card {
          width: 100%;
          max-width: 32rem;
          border: 1px solid #2A2A2A;
          padding: 3rem;
          background-color: transparent;
          text-align: center;
        }
        .unsubscribe-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1rem;
        }
        .unsubscribe-description {
          color: #9ca3af;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        
        .unsubscribe-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: left;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .form-group input {
          background-color: transparent;
          border: 1px solid #2A2A2A;
          padding: 1rem;
          color: #ffffff;
          width: 100%;
          transition: border-color 0.2s ease;
        }
        .form-group input:focus {
          outline: none;
          border-color: #ef4444; /* Red focus to indicate destructive action */
        }
        
        .unsubscribe-btn {
          width: 100%;
          background-color: transparent;
          color: #ef4444;
          border: 1px solid #ef4444;
          padding: 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
        }
        .unsubscribe-btn:hover:not(:disabled) {
          background-color: #ef4444;
          color: #ffffff;
        }
        .unsubscribe-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 1.5rem;
        }

        .success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .success-message {
          font-size: 1.25rem;
          font-weight: 600;
          color: #788E7D;
        }
        .success-subtext {
          color: #9ca3af;
          font-size: 1rem;
        }
        .return-home-btn {
          background-color: #788E7D;
          color: #ffffff;
          text-decoration: none;
          padding: 1rem 2rem;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          transition: background-color 0.2s ease;
        }
        .return-home-btn:hover {
          background-color: #687C6D;
        }
      `}</style>
    </div>
  );
}