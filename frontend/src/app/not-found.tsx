import React from 'react';
import { ErrorView } from '@/components/ui/error-view';
import { HTTP_ERRORS_CATALOG } from '@/lib/errors-catalog';

export const metadata = {
  title: '404 - Plate Empty / Dish Not Found | FoodLine Campus',
  description: 'The requested page, dish, or order token was not found on FoodLine Campus.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-(--bg-canvas,#07070B) flex flex-col justify-center">
      <ErrorView
        error={HTTP_ERRORS_CATALOG[404]}
        customSubtitle="The page, order token, or dish you are looking for has been moved or eaten! Browse today's live menu at Cafe @7."
      />
    </div>
  );
}
