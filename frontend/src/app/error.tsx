'use client';

import React, { useEffect } from 'react';
import { ErrorView } from '@/components/ui/error-view';
import { HTTP_ERRORS_CATALOG } from '@/lib/errors-catalog';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client runtime errors for telemetry & monitoring
    console.error('⚠️ [FoodLine Campus] Client Error Caught by App ErrorBoundary:', error);
  }, [error]);

  const isSimulatedCrash = error?.message?.includes('Deliberate test crash');

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center">
      <ErrorView
        error={HTTP_ERRORS_CATALOG[500]}
        customTitle={isSimulatedCrash ? '🧪 Test Error Boundary Verified' : 'Unexpected Kitchen Exception'}
        customSubtitle={
          isSimulatedCrash
            ? 'This was a deliberate test exception triggered from the /debug dashboard to verify that Next.js React Error Boundary catches runtime faults gracefully.'
            : error.message || 'A client-side runtime exception occurred during rendering.'
        }
        customMessage={
          isSimulatedCrash
            ? 'Success! The React Error Boundary successfully intercepted the simulated crash and prevented an unhandled white-screen freeze. Everything is working as expected.'
            : undefined
        }
        digest={error.digest}
        onRetry={() => {
          if (isSimulatedCrash && typeof window !== 'undefined') {
            window.location.href = '/debug';
          } else {
            reset();
          }
        }}
      />
    </div>
  );
}
