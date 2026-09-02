import React from 'react';
import { ErrorView } from '@/components/ui/error-view';
import { HTTP_ERRORS_CATALOG } from '@/lib/errors-catalog';

export const metadata = {
  title: '503 - Cafeteria Closed / Shift Prep | FoodLine Campus',
  description: 'Cafe @7 is currently between meal service windows or undergoing shift sanitization.',
};

export default function Error503Page() {
  return (
    <div className="min-h-screen bg-(--bg-canvas,#07070B) flex flex-col justify-center py-10">
      <ErrorView error={HTTP_ERRORS_CATALOG[503]} />
    </div>
  );
}
