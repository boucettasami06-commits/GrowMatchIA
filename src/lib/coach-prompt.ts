import type { Questionnaire, RoutineStep, ProgramType } from './schemas';

export function buildCoachPrompt(
  questionnaire: Questionnaire,
  programType: ProgramType,
  routineSteps: RoutineStep[],
  userMessage?: string
): string {
  const morningSteps = routineSteps
    .filter((s) => s.step_type === 'morning')
    .map((s) => s.product_name)
    .join(', ');

  const eveningSteps = routineSteps
    .filter((s) => s.step_type === 'evening')
    .map((s) => s.product_name)
    .join(', ');

  const bonusSteps = routineSteps
    .filter((s) => s.step_type === 'bonus')
    .map((s) => s.product_name)
    .join(', ');

  const concerns: Record<string, string> = {
    acne: 'acne and breakouts',
    redness: 'redness and sensitivity',
    wrinkles: 'fine lines and wrinkles',
    dryness: 'dryness and dehydration',
    hyperpigmentation: 'hyperpigmentation and dark spots',
    oiliness: 'excess oil and shine',
  };

  const concernText = concerns[questionnaire.main_concern] || questionnaire.main_concern;

  const userQuery = userMessage
    ? `\n\nUSER'S QUESTION/REQUEST:\n${userMessage}`
    : '';

  const prompt = `You are a compassionate and knowledgeable skincare coach. Your role is to provide personalized guidance and reassurance about their skincare routine.

USER PROFILE:
- Age: ${questionnaire.age}
- Skin Type: ${questionnaire.skin_type}
- Main Concern: ${concernText}
- Program: ${programType.toUpperCase().replace('-', ' ')}
- Budget: €${questionnaire.budget_monthly}/month
- Daily Time Available: ${questionnaire.time_available_minutes} minutes

THEIR ROUTINE:
- Morning: ${morningSteps || 'No steps'}
- Evening: ${eveningSteps || 'No steps'}
- Weekly Bonus: ${bonusSteps || 'None'}

${userMessage ? `USER QUESTION/REQUEST:\n${userMessage}` : 'Provide encouraging feedback about their routine'}

GUIDELINES:
- Be warm, supportive, and reassuring
- Focus on realistic expectations and skin science
- Address their specific concern (${concernText})
- Consider their time and budget constraints
- If answering a specific question, be helpful and practical
- Keep response concise (2-3 sentences max, 300 chars max)
- No markdown formatting, just plain text
- Be authentic and avoid corporate tone

Your response should reassure them that they're on the right track and motivate them to follow their routine consistently.`;

  return prompt;
}
