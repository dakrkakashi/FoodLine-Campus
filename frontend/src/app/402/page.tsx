import React from 'react';
import { ErrorView } from '@/components/ui/error-view';
import { HTTP_ERRORS_CATALOG } from '@/lib/errors-catalog';

export const metadata = {
  title: '402 - UPI Payment Pending | FoodLine Campus',
  description: 'UPI payment confirmation required to transition order to confirmed state.',
};

export default function Error402Page() {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas,#07070B)] flex flex-col justify-center py-10">
      <ErrorView error={HTTP_ERRORS_CATALOG[402]} />
    </div>
  );
}
