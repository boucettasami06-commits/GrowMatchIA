'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How long does it take to create my routine?',
    answer:
      'Just 5 minutes! Our quick questionnaire asks about your skin type, concerns, and preferences. Our AI then generates a personalized routine instantly.',
  },
  {
    question: 'Do I need any special products?',
    answer:
      'No! We work with products you already love or can easily find. Our recommendations respect your budget and brand preferences.',
  },
  {
    question: 'Will I see results in 4 weeks?',
    answer:
      'Most users see noticeable improvements within 4-8 weeks. However, skincare is personal and results vary. Consistency is key!',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Absolutely. No hidden fees, no contracts. Cancel anytime, and we keep your routine history for future reference.',
  },
  {
    question: 'What if I have allergies?',
    answer:
      'We ask about allergies and sensitivities in our questionnaire. Our AI carefully avoids recommending products with ingredients that could trigger reactions.',
  },
  {
    question: 'Is my data private and secure?',
    answer:
      'Yes. We use bank-level encryption and never share your data with third parties. Your skincare journey is yours alone.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-beige" id="faq">
      <div className="section max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-[var(--color-text)] mb-4">Frequently Asked Questions</h2>
          <p className="text-[var(--color-text-secondary)]">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-[var(--color-border)] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--color-beige)] transition"
              >
                <span className="font-medium text-[var(--color-text)] text-left">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--color-rose)] transition ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 border-t border-[var(--color-border)] bg-white">
                  <p className="text-[var(--color-text-secondary)]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
