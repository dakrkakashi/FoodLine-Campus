import React from 'react';
import { ErrorView } from '@/components/ui/error-view';
import { HTTP_ERRORS_CATALOG } from '@/lib/errors-catalog';

export const metadata = {
  title: '409 - Break Slot 60/60 Cap Reached | FoodLine Campus',
  description: 'The selected campus break slot has reached maximum kitchen capacity.',
};

export default function Error409Page() {
  return (
    <div className="min-h-screen bg-(--bg-canvas,#07070B) flex flex-col justify-center py-10">
      <ErrorView error={HTTP_ERRORS_CATALOG[409]} />
    </div>
  );
}
