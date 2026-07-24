'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Zap } from 'lucide-react';
import Link from 'next/link';
import type { Questionnaire, RoutineStep } from '@/src/lib/schemas';

interface Program {
  id: string;
  program_type: string;
  status: string;
  created_at: string;
}

interface DashboardData {
  program: Program;
  questionnaire: Questionnaire;
}

interface RoutineData {
  routine_id: string;
  program_id: string;
  steps: RoutineStep[];
  total_time_morning_minutes: number;
  total_time_evening_minutes: number;
  expected_results_weeks: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProgramPage({ params: paramsPromise }: PageProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    const initParams = async () => {
      const params = await paramsPromise;
      setId(params.id);
    };
    initParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (!id) return;

    const fetchProgramData = async () => {
      try {
        const token = localStorage.getItem('sb-auth-token');
        if (!token) {
          setError('Please log in to view this program');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/programs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load program');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProgramData();
  }, [id]);

  const handleGenerateRoutine = async () => {
    if (!data) return;

    setGenerating(true);
    setError(null);

    try {
      const token = localStorage.getItem('sb-auth-token');
      if (!token) {
        throw new Error('Please log in to generate a routine');
      }

      const response = await fetch('/api/routines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          program_id: id,
          questionnaire_id: data.program.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate routine');
      }

      const result = await response.json();
      setRoutine(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate routine');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[var(--color-text-secondary)]">Loading your program...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--color-rose)] hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error || 'Program not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { program, questionnaire } = data;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--color-rose)] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Success message */}
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg flex items-gap gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-green-900">Program Created!</h2>
            <p className="text-sm text-green-700 mt-1">
              Your personalized {program.program_type.replace('-', ' ')} program is ready.
            </p>
          </div>
        </div>

        {/* Program overview */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-[var(--color-beige)] rounded-lg">
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium">
              Program Type
            </p>
            <h3 className="text-2xl font-bold text-[var(--color-text)] mt-2 capitalize">
              {program.program_type.replace('-', ' ')}
            </h3>
          </div>
          <div className="p-6 bg-[var(--color-beige)] rounded-lg">
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium">
              Status
            </p>
            <p className="text-2xl font-bold text-[var(--color-rose)] mt-2 capitalize">
              {program.status}
            </p>
          </div>
        </div>

        {/* Questionnaire responses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Your Profile
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 border border-[var(--color-border)] rounded-lg">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium mb-2">
                Age
              </p>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {questionnaire.age} years
              </p>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-lg">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium mb-2">
                Country
              </p>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {questionnaire.country || 'Not specified'}
              </p>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-lg">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium mb-2">
                Skin Type
              </p>
              <p className="text-lg font-semibold text-[var(--color-text)] capitalize">
                {questionnaire.skin_type}
              </p>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-lg">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium mb-2">
                Main Concern
              </p>
              <p className="text-lg font-semibold text-[var(--color-text)] capitalize">
                {questionnaire.main_concern}
              </p>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-lg">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium mb-2">
                Monthly Budget
              </p>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                €{questionnaire.budget_monthly}
              </p>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-lg">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium mb-2">
                Time Available
              </p>
              <p className="text-lg font-semibold text-[var(--color-text)]">
                {questionnaire.time_available_minutes} minutes
              </p>
            </div>
          </div>

          {questionnaire.allergies.length > 0 && (
            <div className="p-4 border border-[var(--color-border)] rounded-lg">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium mb-3">
                Allergies & Sensitivities
              </p>
              <div className="flex flex-wrap gap-2">
                {questionnaire.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="px-3 py-1 bg-[var(--color-rose)] text-white rounded-full text-sm capitalize"
                  >
                    {allergy.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generate routine section */}
        {!routine && (
          <div className="mt-12 p-6 bg-[var(--color-beige)] rounded-lg">
            <h3 className="font-semibold text-[var(--color-text)] mb-3">
              Ready for your personalized routine?
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Our AI will create a custom skincare routine based on your profile.
            </p>
            <button
              onClick={handleGenerateRoutine}
              disabled={generating}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating Your Routine...' : 'Generate My Routine'}
            </button>
          </div>
        )}

        {/* Routine display */}
        {routine && (
          <div className="mt-12 space-y-8">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-[var(--color-rose)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text)]">
                Your Personalized Routine
              </h2>
            </div>

            {/* Routine summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-[var(--color-beige)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[var(--color-rose)]" />
                  <span className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium">
                    Morning
                  </span>
                </div>
                <p className="text-2xl font-bold text-[var(--color-text)]">
                  {routine.total_time_morning_minutes}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">minutes</p>
              </div>

              <div className="p-4 bg-[var(--color-beige)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[var(--color-rose)]" />
                  <span className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium">
                    Evening
                  </span>
                </div>
                <p className="text-2xl font-bold text-[var(--color-text)]">
                  {routine.total_time_evening_minutes}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">minutes</p>
              </div>

              <div className="p-4 bg-[var(--color-beige)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-[var(--color-rose)]" />
                  <span className="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] font-medium">
                    Results
                  </span>
                </div>
                <p className="text-2xl font-bold text-[var(--color-text)]">
                  {routine.expected_results_weeks}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">weeks</p>
              </div>
            </div>

            {/* Morning routine */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Morning Routine
              </h3>
              <div className="space-y-3">
                {routine.steps
                  .filter((step) => step.step_type === 'morning')
                  .map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-rose)] transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--color-text)]">
                            {step.step_number}. {step.product_name}
                          </h4>
                          {step.product_category && (
                            <p className="text-xs text-[var(--color-text-secondary)] capitalize">
                              {step.product_category.replace('_', ' ')}
                            </p>
                          )}
                        </div>
                        {step.time_minutes && (
                          <span className="text-sm text-[var(--color-rose)] font-medium">
                            {step.time_minutes} min
                          </span>
                        )}
                      </div>
                      {step.instructions && (
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {step.instructions}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Evening routine */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Evening Routine
              </h3>
              <div className="space-y-3">
                {routine.steps
                  .filter((step) => step.step_type === 'evening')
                  .map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-rose)] transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--color-text)]">
                            {step.step_number}. {step.product_name}
                          </h4>
                          {step.product_category && (
                            <p className="text-xs text-[var(--color-text-secondary)] capitalize">
                              {step.product_category.replace('_', ' ')}
                            </p>
                          )}
                        </div>
                        {step.time_minutes && (
                          <span className="text-sm text-[var(--color-rose)] font-medium">
                            {step.time_minutes} min
                          </span>
                        )}
                      </div>
                      {step.instructions && (
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {step.instructions}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Bonus treatments */}
            {routine.steps.some((step) => step.step_type === 'bonus') && (
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                  Bonus Treatments
                </h3>
                <div className="space-y-3">
                  {routine.steps
                    .filter((step) => step.step_type === 'bonus')
                    .map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-[var(--color-rose)] border-dashed rounded-lg bg-[var(--color-rose)]/5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[var(--color-text)]">
                              {step.product_name}
                            </h4>
                            {step.product_category && (
                              <p className="text-xs text-[var(--color-text-secondary)] capitalize">
                                {step.product_category.replace('_', ' ')} • 1-2x per week
                              </p>
                            )}
                          </div>
                          {step.time_minutes && (
                            <span className="text-sm text-[var(--color-rose)] font-medium">
                              {step.time_minutes} min
                            </span>
                          )}
                        </div>
                        {step.instructions && (
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {step.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
