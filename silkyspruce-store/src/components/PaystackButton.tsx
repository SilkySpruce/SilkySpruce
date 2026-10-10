"use client";

import { usePaystackPayment } from 'react-paystack';

export default function PaystackButton({ config, onSuccess, onClose, onValidation, className, text }: any) {
  const initializePayment = usePaystackPayment(config);

  const handleClick = () => {
    // Run the address validation from the cart page first
    if (onValidation && !onValidation()) {
      return; 
    }
    // If validation passes, pop open Paystack!
    initializePayment({ onSuccess, onClose } as any);
  };

  return (
    <button className={className} onClick={handleClick}>
      {text || "PROCEED TO CHECKOUT"}
    </button>
  );
}