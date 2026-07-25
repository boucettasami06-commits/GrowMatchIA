import { Suspense } from 'react';
import SignupForm from '@/components/auth/SignupForm';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
