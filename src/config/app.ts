/**
 * Application configuration
 * Central place for app-wide constants and settings
 */

export const APP_NAME = 'GlowMatch';
export const APP_DESCRIPTION = 'Your personal AI beauty coach';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Pricing tiers
export const PRICING_TIERS = {
  ESSENTIAL: {
    id: 'essential',
    name: 'Essential',
    price: 9.99,
    currency: 'EUR',
    features: [
      '1 active program',
      'Weekly email digest',
      'Chat IA on-demand',
      'Basic routine history',
    ],
  },
  PLUS: {
    id: 'plus',
    name: 'Plus',
    price: 19.99,
    currency: 'EUR',
    features: [
      'Up to 2 active programs',
      'Weekly email digest + bonus tips',
      'Priority chat response',
      'Full analytics',
    ],
  },
} as const;

// Skincare programs available in V1
export const SKINCARE_PROGRAMS = [
  {
    id: 'anti-acne',
    name: 'Anti-Acné',
    description: 'For clear skin and oil control',
  },
  {
    id: 'glow',
    name: 'Glow',
    description: 'For hydration and radiance',
  },
  {
    id: 'anti-age',
    name: 'Anti-Âge',
    description: 'For fine lines and firmness',
  },
  {
    id: 'hair',
    name: 'Cheveux',
    description: 'For hair health and shine',
  },
] as const;

// API timeouts
export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  OPENAI: 60000, // 60 seconds (AI generation can be slower)
} as const;

// Feature flags (for progressive rollout)
export const FEATURE_FLAGS = {
  MULTI_PROGRAM: false, // Enable 2nd program in V1.5
  PROACTIVE_COACH: false, // Enable coach relance in V1.5
  PRODUCT_ALTERNATIVES: false, // Enable alternatives in V1.5
} as const;
