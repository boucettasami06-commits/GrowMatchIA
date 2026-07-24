'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import type { Questionnaire } from '@/src/lib/schemas';

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProgramPage({ params: paramsPromise }: PageProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
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

        {/* Next steps */}
        <div className="mt-12 p-6 bg-[var(--color-beige)] rounded-lg">
          <h3 className="font-semibold text-[var(--color-text)] mb-3">
            What&apos;s next?
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li>✓ We're analyzing your profile</li>
            <li>○ Your personalized routine will be ready soon</li>
            <li>○ Start your skincare journey with AI guidance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
