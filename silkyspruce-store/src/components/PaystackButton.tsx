"use client";

import React, { useEffect, useState } from 'react';

interface PaystackConfig {
  reference: string;
  email: string;
  amount: number;
  currency?: string;
  publicKey: string;
  metadata?: any;
}

interface PaystackButtonProps {
  config: PaystackConfig;
  onSuccess: (reference: any) => void;
  onClose: () => void;
  onValidation: () => boolean;
  className?: string;
  text: string;
}

export default function PaystackButton({
  config,
  onSuccess,
  onClose,
  onValidation,
  className,
  text,
}: PaystackButtonProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handlePaystackClick = () => {
    if (!onValidation()) return;

    if (!scriptLoaded || !(window as any).PaystackPop) {
      alert('Paystack SDK failed to load. Please check your connection.');
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: config.publicKey,
      email: config.email,
      amount: config.amount,
      currency: config.currency || 'KES',
      ref: config.reference,
      callback: function (response: any) {
        onSuccess(response);
      },
      onClose: function () {
        onClose();
      },
    });

    handler.openIframe();
  };

  return (
    <button type="button" onClick={handlePaystackClick} className={className}>
      {text}
    </button>
  );
}