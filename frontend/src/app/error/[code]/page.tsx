import React from 'react';
import { Metadata } from 'next';
import { ErrorView } from '@/components/ui/error-view';
import { getErrorMetadata, HTTP_ERRORS_CATALOG } from '@/lib/errors-catalog';

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const error = getErrorMetadata(code);
  return {
    title: `${error.code} - ${error.title} | FoodLine Campus`,
    description: error.subtitle,
  };
}

export default async function DynamicErrorPage({ params }: PageProps) {
  const { code } = await params;
  const error = getErrorMetadata(code);

  return (
    <div className="min-h-screen bg-(--bg-canvas,#07070B) flex flex-col justify-center py-10">
      <ErrorView error={error} />
    </div>
  );
}
