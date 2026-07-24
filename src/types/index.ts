/**
 * Core type definitions
 */

// User-related types
export type User = {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
};

// Program types
export type Program = {
  id: string;
  user_id: string;
  program_type: 'anti-acne' | 'glow' | 'anti-age' | 'hair';
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
};

// Questionnaire/Profile types
export type SkinProfile = {
  skin_type: 'dry' | 'mixed' | 'oily' | 'sensitive';
  main_concern: 'acne' | 'redness' | 'wrinkles' | 'dryness' | 'hyperpigmentation' | 'other';
  allergies: string[];
  budget_monthly: number;
  preferred_brands?: string[];
};

// Routine types
export type RoutineStep = {
  step: number;
  product_name: string;
  time_minutes: number;
  instructions: string;
};

export type Routine = {
  id: string;
  program_id: string;
  morning_steps: RoutineStep[];
  evening_steps: RoutineStep[];
  bonus_routine?: {
    name: string;
    frequency: string;
    instructions: string;
  };
  products_count: number;
  total_time_minutes: number;
  created_at: string;
};

// Subscription types
export type Subscription = {
  id: string;
  user_id: string;
  tier: 'essential' | 'plus';
  status: 'active' | 'canceled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  whop_subscription_id: string;
  created_at: string;
  updated_at: string;
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
};

export type ApiError = {
  message: string;
  code: string;
  statusCode: number;
};
