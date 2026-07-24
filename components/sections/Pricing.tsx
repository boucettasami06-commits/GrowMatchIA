import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Essential',
    price: 9.99,
    description: 'Perfect for beginners',
    features: [
      '1 active program',
      'Weekly email digest',
      'Chat IA on-demand',
      'Routine history',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Plus',
    price: 19.99,
    description: 'For the skincare enthusiasts',
    features: [
      'Up to 2 active programs',
      'Weekly email digest + bonus tips',
      'Priority chat response',
      'Full analytics dashboard',
      'Advanced personalization',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
];

export default function Pricing() {
  return (
    <section className="section-light" id="pricing">
      <div className="section">
        <div className="text-center mb-16">
          <h2 className="text-[var(--color-text)] mb-4">Simple, Transparent Pricing</h2>
          <p className="text-[var(--color-text-secondary)] text-lg">
            No credit card required to start. Try essential features free.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 border-2 transition ${
                tier.featured
                  ? 'border-[var(--color-rose)] bg-[var(--color-rose-light)]'
                  : 'border-[var(--color-border)] bg-white'
              }`}
            >
              {tier.featured && (
                <div className="inline-block px-3 py-1 bg-[var(--color-rose)] text-white text-xs font-bold rounded-full mb-4">
                  MOST POPULAR
                </div>
              )}

              <h3 className="text-[var(--color-text)] mb-2">{tier.name}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-4">{tier.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--color-rose)]">€{tier.price}</span>
                <span className="text-[var(--color-text-secondary)] ml-2">/month</span>
              </div>

              <button
                className={`w-full btn mb-8 ${
                  tier.featured ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {tier.cta}
              </button>

              <div className="space-y-4">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[var(--color-rose)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text)]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
