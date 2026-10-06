"use client";

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion-container">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="accordion-item">
            <button 
              className={`accordion-trigger ${isOpen ? 'trigger-active' : ''}`}
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <span className="accordion-question">{item.question}</span>
              <span className="accordion-icon">
                {isOpen ? <Minus size={20} strokeWidth={1.5} /> : <Plus size={20} strokeWidth={1.5} />}
              </span>
            </button>
            
            <div className={`accordion-content-wrapper ${isOpen ? 'content-open' : ''}`}>
              <div className="accordion-content">
                <p className="accordion-answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        .accordion-container {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .accordion-item {
          border-bottom: 1px solid #2A2A2A;
        }
        .accordion-trigger {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          text-align: left;
          transition: color 0.2s ease;
        }
        .accordion-trigger:hover, .trigger-active {
          color: #788E7D;
        }
        .accordion-question {
          font-size: 1.125rem;
          font-weight: 600;
          padding-right: 1rem;
        }
        .accordion-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .trigger-active .accordion-icon {
          transform: rotate(180deg);
        }
        .accordion-content-wrapper {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease-out;
        }
        .content-open {
          grid-template-rows: 1fr;
        }
        .accordion-content {
          overflow: hidden;
        }
        .accordion-answer {
          color: #d1d5db;
          font-size: 1rem;
          line-height: 1.6;
          padding-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}