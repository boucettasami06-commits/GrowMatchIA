import { z } from 'zod';

// Program types enum
export const PROGRAM_TYPES = ['anti-acne', 'glow', 'anti-age', 'hair'] as const;
export type ProgramType = (typeof PROGRAM_TYPES)[number];

// Skin types enum
export const SKIN_TYPES = ['dry', 'mixed', 'oily', 'sensitive'] as const;
export type SkinType = (typeof SKIN_TYPES)[number];

// Common allergies/sensitivities
export const ALLERGIES = [
  'fragrances',
  'alcohol',
  'aha_bha',
  'essential_oils',
  'none',
] as const;

// Questionnaire form schema (multi-step)
export const QuestionnaireStepOneSchema = z.object({
  program_type: z.enum(PROGRAM_TYPES),
});
export type QuestionnaireStepOne = z.infer<typeof QuestionnaireStepOneSchema>;

export const QuestionnaireStepTwoSchema = z.object({
  age: z
    .number()
    .int()
    .min(18, { message: 'Must be at least 18' })
    .max(100, { message: 'Invalid age' }),
  country: z.string().min(2, { message: 'Please select a country' }).optional(),
});
export type QuestionnaireStepTwo = z.infer<typeof QuestionnaireStepTwoSchema>;

export const QuestionnaireStepThreeSchema = z.object({
  skin_type: z.enum(SKIN_TYPES),
  main_concern: z.string().min(1),
  allergies: z
    .array(z.string())
    .default([])
    .refine(
      (val) => val.length <= 3,
      'Please select maximum 3 allergies'
    ),
});
export type QuestionnaireStepThree = z.infer<
  typeof QuestionnaireStepThreeSchema
>;

export const QuestionnaireStepFourSchema = z.object({
  budget_monthly: z
    .number()
    .int()
    .positive({ message: 'Budget must be positive' }),
  time_available_minutes: z
    .number()
    .int()
    .min(5, { message: 'Minimum 5 minutes' })
    .max(60, { message: 'Maximum 60 minutes' }),
  preferred_brands: z
    .array(z.string())
    .default([])
    .refine(
      (val) => val.length <= 5,
      'Please select maximum 5 brands'
    ),
});
export type QuestionnaireStepFour = z.infer<
  typeof QuestionnaireStepFourSchema
>;

// Complete questionnaire schema
export const QuestionnaireSchema = QuestionnaireStepOneSchema.merge(
  QuestionnaireStepTwoSchema
)
  .merge(QuestionnaireStepThreeSchema)
  .merge(QuestionnaireStepFourSchema);
export type Questionnaire = z.infer<typeof QuestionnaireSchema>;

// API request/response types
export const CreateProgramRequestSchema = QuestionnaireSchema;
export type CreateProgramRequest = z.infer<
  typeof CreateProgramRequestSchema
>;

export const CreateProgramResponseSchema = z.object({
  program_id: z.string().uuid(),
  program_type: z.enum(PROGRAM_TYPES),
  created_at: z.string().datetime(),
  status: z.literal('active'),
});
export type CreateProgramResponse = z.infer<
  typeof CreateProgramResponseSchema
>;

// Error response
export const ErrorResponseSchema = z.object({
  error: z.string(),
  statusCode: z.number(),
  details: z.record(z.string(), z.any()).optional(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// Routine step schema
export const RoutineStepSchema = z.object({
  step_type: z.enum(['morning', 'evening', 'bonus']),
  step_number: z.number().int().positive(),
  product_name: z.string().min(1),
  product_category: z.string().optional(),
  time_minutes: z.number().int().positive().optional(),
  instructions: z.string().optional(),
});
export type RoutineStep = z.infer<typeof RoutineStepSchema>;

// Routine schema
export const RoutineSchema = z.object({
  program_id: z.string().uuid(),
  expected_results_weeks: z.number().int().positive().default(8),
  total_time_morning_minutes: z.number().int().nonnegative(),
  total_time_evening_minutes: z.number().int().nonnegative(),
  steps: z.array(RoutineStepSchema),
});
export type Routine = z.infer<typeof RoutineSchema>;

// Routine generation request
export const GenerateRoutineRequestSchema = z.object({
  program_id: z.string().uuid(),
  questionnaire_id: z.string().uuid(),
});
export type GenerateRoutineRequest = z.infer<
  typeof GenerateRoutineRequestSchema
>;

// Routine generation response
export const GenerateRoutineResponseSchema = z.object({
  routine_id: z.string().uuid(),
  program_id: z.string().uuid(),
  steps: z.array(RoutineStepSchema),
  total_time_morning_minutes: z.number().int(),
  total_time_evening_minutes: z.number().int(),
  expected_results_weeks: z.number().int(),
});
export type GenerateRoutineResponse = z.infer<
  typeof GenerateRoutineResponseSchema
>;
