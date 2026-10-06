import type { ReactNode } from 'react';
import React from 'react';
import { PickupQrTrackerCard } from './PickupQrTrackerCard';
import type { PickupQrTrackerCardProps } from './PickupQrTrackerCard.types';

// Standalone CSF 3.0 Storybook types compatible without external dependencies
export interface StoryMeta<T> {
  title: string;
  component: React.ComponentType<T>;
  parameters?: Record<string, unknown>;
  tags?: string[];
  argTypes?: Record<string, unknown>;
}

export interface StoryObject<T> {
  name?: string;
  args: T;
  render?: (args: T) => ReactNode;
}

const meta: StoryMeta<PickupQrTrackerCardProps> = {
  title: 'Order/PickupQrTrackerCard',
  component: PickupQrTrackerCard,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['PENDING_PAYMENT', 'CONFIRMED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED'],
      description: 'Order lifecycle stage',
    },
    orderToken: { control: 'text', description: 'Student meal token identifier' },
    pickupOtp: { control: 'text', description: '4-digit counter pickup OTP' },
    canteenName: { control: 'text', description: 'Campus cafeteria location' },
    slotLabel: { control: 'text', description: 'Recess break pickup slot' },
  },
};

export default meta;

const baseProps: PickupQrTrackerCardProps = {
  orderToken: 'FL-1793',
  pickupOtp: '6065',
  status: 'PREPARING',
  canteenName: 'Cafe @7',
  slotLabel: '10:30 AM - 10:45 AM Recess Break',
  slotEndTime: '10:45 AM',
  totalAmount: 90.0,
  utrNumber: '928374615243',
  items: [
    { id: 'item-1', name: 'Special Cheese Vada Pav', quantity: 2, price: 35.0 },
    { id: 'item-2', name: 'Masala Chai Cutting', quantity: 2, price: 10.0 },
  ],
  notes: 'Extra green chutney, less sweet tea',
};

/**
 * 1. Confirmed Order Story (Ticket Queued in Kitchen)
 */
export const OrderConfirmed: StoryObject<PickupQrTrackerCardProps> = {
  name: '1. Order Confirmed',
  args: {
    ...baseProps,
    status: 'CONFIRMED',
  },
};

/**
 * 2. Cooking / In Prep Story (Chef is Cooking)
 */
export const CookingInPreparation: StoryObject<PickupQrTrackerCardProps> = {
  name: '2. Cooking on Stove',
  args: {
    ...baseProps,
    status: 'PREPARING',
  },
};

/**
 * 3. Ready for Express Pickup Story (Celebratory Glow & Instant Collection)
 */
export const ReadyForPickup: StoryObject<PickupQrTrackerCardProps> = {
  name: '3. Ready at Counter (Urgent)',
  args: {
    ...baseProps,
    status: 'READY',
  },
};

/**
 * 4. Collected & Completed Story
 */
export const OrderCollected: StoryObject<PickupQrTrackerCardProps> = {
  name: '4. Order Handed Over',
  args: {
    ...baseProps,
    status: 'COLLECTED',
  },
};

/**
 * 5. Defensive State: Loading Skeleton
 */
export const LoadingSkeleton: StoryObject<PickupQrTrackerCardProps> = {
  name: '5. Defensive: Loading Skeleton',
  args: {
    ...baseProps,
    isLoading: true,
  },
};

/**
 * 6. Defensive State: Error with Retry
 */
export const NetworkError: StoryObject<PickupQrTrackerCardProps> = {
  name: '6. Defensive: Network Error',
  args: {
    ...baseProps,
    error: 'Failed to synchronize live token stream. Campus Wi-Fi disconnected.',
    onRetry: () => alert('Retrying connection...'),
  },
};

/**
 * 7. Defensive State: Empty Order Pass
 */
export const EmptyOrderState: StoryObject<PickupQrTrackerCardProps> = {
  name: '7. Defensive: Empty Order State',
  args: {
    ...baseProps,
    orderToken: '',
    pickupOtp: '',
    isEmpty: true,
  },
};

