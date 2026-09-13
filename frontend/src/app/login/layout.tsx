import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student & Staff Login',
  description:
    'Sign in to FoodLine Campus with your Sanjivani University student PRN or institutional Google account to place pre-orders and track pickup tokens.',
  alternates: {
    canonical: '/login',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
