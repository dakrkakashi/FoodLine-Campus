import React from 'react';
import { ErrorView } from '@/components/ui/error-view';
import { HTTP_ERRORS_CATALOG } from '@/lib/errors-catalog';

export const metadata = {
  title: '401 - Student Session Expired | FoodLine Campus',
  description: 'Authentication required to access student pre-ordering or cafeteria management.',
};

export default function Error401Page() {
  return (
    <div className="min-h-screen bg-(--bg-canvas,#07070B) flex flex-col justify-center py-10">
      <ErrorView error={HTTP_ERRORS_CATALOG[401]} />
    </div>
  );
}
