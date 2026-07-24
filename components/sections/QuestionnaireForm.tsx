'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type {
  QuestionnaireStepOne,
  QuestionnaireStepTwo,
  QuestionnaireStepThree,
  QuestionnaireStepFour,
} from '@/src/lib/schemas';
import { PROGRAM_TYPES, SKIN_TYPES, ALLERGIES } from '@/src/lib/schemas';

type FormData = QuestionnaireStepOne &
  QuestionnaireStepTwo &
  QuestionnaireStepThree &
  QuestionnaireStepFour;

export default function QuestionnaireForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FormData>>({
    allergies: [],
    preferred_brands: [],
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    setError(null);
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sb-auth-token') || ''}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          throw new Error('Please log in to create a program');
        }
        throw new Error(data.error || 'Failed to create program');
      }

      const result = await response.json();
      window.location.href = `/programs/${result.program_id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[var(--color-text)]">
              Step {step} of 4
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {Math.round((step / 4) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[var(--color-border)] rounded-full h-2">
            <div
              className="bg-[var(--color-rose)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Program selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
                  Choose Your Program
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                  What&apos;s your primary beauty goal?
                </p>
              </div>

              <div className="grid gap-4">
                {PROGRAM_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
                      formData.program_type === type
                        ? 'border-[var(--color-rose)] bg-[var(--color-rose-light)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-rose)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="program_type"
                      value={type}
                      checked={formData.program_type === type}
                      onChange={(e) =>
                        handleInputChange('program_type', e.target.value)
                      }
                      className="sr-only"
                    />
                    <div className="font-medium text-[var(--color-text)] capitalize">
                      {type.replace('-', ' ')}
                    </div>
                    <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                      {getProgramDescription(type)}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
                  About You
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                  Help us personalize your routine
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age || ''}
                  onChange={(e) =>
                    handleInputChange('age', parseInt(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Country (optional)
                </label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]"
                  placeholder="Where are you from?"
                />
              </div>
            </div>
          )}

          {/* Step 3: Skin */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
                  Your Skin
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                  Tell us about your skin type and concerns
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                  Skin Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {SKIN_TYPES.map((type) => (
                    <label
                      key={type}
                      className={`relative p-3 border rounded-lg cursor-pointer transition ${
                        formData.skin_type === type
                          ? 'border-[var(--color-rose)] bg-[var(--color-rose-light)]'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="skin_type"
                        value={type}
                        checked={formData.skin_type === type}
                        onChange={(e) =>
                          handleInputChange('skin_type', e.target.value)
                        }
                        className="sr-only"
                      />
                      <div className="font-medium text-sm capitalize">
                        {type}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Main Skin Concern
                </label>
                <select
                  value={formData.main_concern || ''}
                  onChange={(e) =>
                    handleInputChange('main_concern', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]"
                >
                  <option value="">Select a concern</option>
                  <option value="acne">Acne & Breakouts</option>
                  <option value="redness">Redness & Sensitivity</option>
                  <option value="wrinkles">Fine Lines & Wrinkles</option>
                  <option value="dryness">Dryness</option>
                  <option value="hyperpigmentation">Hyperpigmentation</option>
                  <option value="oiliness">Oiliness</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                  Allergies/Sensitivities (optional)
                </label>
                <div className="space-y-2">
                  {ALLERGIES.map((allergy) => (
                    <label
                      key={allergy}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          formData.allergies?.includes(allergy) || false
                        }
                        onChange={(e) => {
                          const current = formData.allergies || [];
                          handleInputChange(
                            'allergies',
                            e.target.checked
                              ? [...current, allergy]
                              : current.filter((a) => a !== allergy)
                          );
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[var(--color-text)] capitalize">
                        {allergy.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Budget & Time */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
                  Routine Preferences
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                  Final details to personalize your routine
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                  Monthly Budget (€)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[10, 30, 50, 100].map((budget) => (
                    <label
                      key={budget}
                      className={`relative p-3 border rounded-lg cursor-pointer text-center transition ${
                        formData.budget_monthly === budget
                          ? 'border-[var(--color-rose)] bg-[var(--color-rose-light)]'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={budget}
                        checked={formData.budget_monthly === budget}
                        onChange={() =>
                          handleInputChange('budget_monthly', budget)
                        }
                        className="sr-only"
                      />
                      <div className="font-medium">€{budget}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-3">
                  Time Available (minutes)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[5, 10, 15].map((time) => (
                    <label
                      key={time}
                      className={`relative p-3 border rounded-lg cursor-pointer text-center transition ${
                        formData.time_available_minutes === time
                          ? 'border-[var(--color-rose)] bg-[var(--color-rose-light)]'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="time"
                        value={time}
                        checked={formData.time_available_minutes === time}
                        onChange={() =>
                          handleInputChange('time_available_minutes', time)
                        }
                        className="sr-only"
                      />
                      <div className="font-medium">{time} min</div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary ml-auto flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating program...' : 'Create My Routine'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function getProgramDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'anti-acne': 'Clear skin and oil control',
    glow: 'Hydration and radiance',
    'anti-age': 'Fine lines and firmness',
    hair: 'Shine and strength',
  };
  return descriptions[type] || '';
}
