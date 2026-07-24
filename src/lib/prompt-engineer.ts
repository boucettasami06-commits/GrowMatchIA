import type { Questionnaire, ProgramType } from './schemas';

export function buildRoutinePrompt(
  questionnaire: Questionnaire,
  programType: ProgramType
): string {
  const concerns: Record<string, string> = {
    acne: 'acne and breakouts',
    redness: 'redness and sensitivity',
    wrinkles: 'fine lines and wrinkles',
    dryness: 'dryness and dehydration',
    hyperpigmentation: 'hyperpigmentation and dark spots',
    oiliness: 'excess oil and shine',
  };

  const concernText = concerns[questionnaire.main_concern] || questionnaire.main_concern;

  const allergiesText =
    questionnaire.allergies.length > 0
      ? `\nAvoid: ${questionnaire.allergies.join(', ')}`
      : '';

  const prompt = `You are a professional skincare expert. Generate a personalized skincare routine.

USER PROFILE:
- Age: ${questionnaire.age}
- Country: ${questionnaire.country || 'Not specified'}
- Skin Type: ${questionnaire.skin_type}
- Main Concern: ${concernText}
- Budget: €${questionnaire.budget_monthly}/month
- Time Available: ${questionnaire.time_available_minutes} minutes${allergiesText}

PROGRAM TYPE: ${programType.toUpperCase().replace('-', ' ')}

Generate a complete skincare routine with:
1. MORNING routine (steps and estimated time)
2. EVENING routine (steps and estimated time)
3. BONUS treatments (optional weekly treatments)

For each product, specify:
- Product name (specific product or category)
- Product category (e.g., cleanser, toner, serum, moisturizer, sunscreen)
- Time needed (in minutes)
- Instructions (brief, actionable steps)

Constraints:
- Total morning routine: max ${questionnaire.time_available_minutes} minutes
- Total evening routine: max ${questionnaire.time_available_minutes} minutes
- Must stay within €${questionnaire.budget_monthly}/month budget
- Products must be suitable for ${questionnaire.skin_type} skin
- Must address ${concernText}
- Expected visible results in 8 weeks

Return the routine in this exact JSON format:
{
  "morning_steps": [
    {
      "step_number": 1,
      "product_name": "string",
      "product_category": "string",
      "time_minutes": number,
      "instructions": "string"
    }
  ],
  "evening_steps": [
    {
      "step_number": 1,
      "product_name": "string",
      "product_category": "string",
      "time_minutes": number,
      "instructions": "string"
    }
  ],
  "bonus_treatments": [
    {
      "step_number": 1,
      "product_name": "string",
      "product_category": "string",
      "time_minutes": number,
      "instructions": "string"
    }
  ],
  "total_time_morning_minutes": number,
  "total_time_evening_minutes": number,
  "summary": "Brief explanation of the routine and expected results"
}`;

  return prompt;
}
