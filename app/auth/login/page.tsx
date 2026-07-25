import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
