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

  return (
    <div className="min-h-screen bg-(--bg-canvas,#07070B) flex flex-col justify-center">
      <ErrorView
        error={HTTP_ERRORS_CATALOG[500]}
        customTitle="Unexpected Kitchen Exception"
        customSubtitle={error.message || 'A client-side runtime exception occurred during rendering.'}
        digest={error.digest}
        onRetry={reset}
      />
    </div>
  );
}
