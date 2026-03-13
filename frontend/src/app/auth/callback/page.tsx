'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const isNew = searchParams.get('isNew') === 'true';

    if (accessToken && refreshToken) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
      setAuth(
        { id: '', email: '', profileComplete: !isNew },
        accessToken,
        refreshToken,
      );
      router.replace(isNew ? '/onboarding' : '/app');
    } else {
      router.replace('/auth/login');
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-violet-400">Completing sign in...</div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-violet-400">Loading...</div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
