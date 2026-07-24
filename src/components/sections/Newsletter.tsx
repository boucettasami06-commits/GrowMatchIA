'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // TODO: Connect to ConvertKit/Mailchimp API in Phase 3
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section className="section-light">
      <div className="section max-w-2xl">
        <div className="bg-[var(--color-rose-light)] rounded-2xl p-12 text-center">
          <h2 className="text-[var(--color-text)] mb-4">
            Get Skincare Tips Weekly
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Subscribe to our newsletter for beauty tips, product recommendations, and exclusive offers.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn btn-primary disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {status === 'success' && (
            <p className="text-[var(--color-rose)] font-medium mt-3">
              ✓ Check your email to confirm!
            </p>
          )}

          <p className="text-xs text-[var(--color-text-secondary)] mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
