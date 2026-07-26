'use client';

import { Zap, TrendingUp, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Personalized Routine',
    description: 'AI analyzes your skin type, concerns, and preferences to create a routine tailored just for you.',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'Monitor your skin journey with weekly check-ins and see visible improvements over 12 weeks.',
  },
  {
    icon: MessageSquare,
    title: 'AI Coach Support',
    description: 'Chat with your AI coach anytime. Get product recommendations and skincare tips when you need them.',
  },
];

export default function Features() {
  return (
    <section className="section-beige">
      <div className="section">
        <div className="text-center mb-16">
          <h2 className="text-[var(--color-text)] mb-4">Why GlowMatch?</h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
            We&apos;re not just another skincare app. We&apos;re your personal beauty coach.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 border border-[var(--color-border)] hover:shadow-lg transition"
              >
                <div className="w-12 h-12 bg-[var(--color-rose-light)] rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[var(--color-rose)]" />
                </div>
                <h3 className="text-[var(--color-text)] mb-3">{feature.title}</h3>
                <p className="text-[var(--color-text-secondary)]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
