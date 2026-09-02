'use client';

import React from 'react';
import { ErrorView } from '@/components/ui/error-view';
import { HTTP_ERRORS_CATALOG } from '@/lib/errors-catalog';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07070B] text-[#F5F5F7] font-sans flex flex-col justify-center">
        <ErrorView
          error={HTTP_ERRORS_CATALOG[500]}
          customTitle="Global Root Layout Exception"
          customSubtitle={error.message || 'An unexpected failure occurred at the root application layout.'}
          digest={error.digest}
          onRetry={reset}
        />
      </body>
    </html>
  );
}
