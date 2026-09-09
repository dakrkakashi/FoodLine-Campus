'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ErrorView } from '@/components/ui/error-view';
import { getErrorMetadata } from '@/lib/errors-catalog';

export default function DynamicErrorPage() {
  const params = useParams();
  const code = (params?.code as string) || '500';
  const error = getErrorMetadata(code);

  return (
    <div className="min-h-screen bg-(--bg-canvas,#07070B) flex flex-col justify-center py-10">
      <ErrorView error={error} />
    </div>
  );
}

