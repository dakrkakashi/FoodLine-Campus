import React from 'react';
import { ErrorView } from '@/components/ui/error-view';
import { HTTP_ERRORS_CATALOG } from '@/lib/errors-catalog';

export const metadata = {
  title: '403 - Kitchen & Staff Only | FoodLine Campus',
  description: 'Access restricted to authorized cafeteria staff and kitchen attendants.',
};

export default function Error403Page() {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas,#07070B)] flex flex-col justify-center py-10">
      <ErrorView error={HTTP_ERRORS_CATALOG[403]} />
    </div>
  );
}
