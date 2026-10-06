import type { OrderStatus } from '@/lib/types';

/**
 * Summary of an item within the tracked order.
 */
export interface TrackedOrderItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
}

/**
 * Props definition for the PickupQrTrackerCard component.
 */
export interface PickupQrTrackerCardProps {
  /** Unique student order token, e.g. "FL-1793" */
  orderToken: string;

  /** 4-digit physical counter pickup OTP, e.g. "6065" */
  pickupOtp: string;

  /** Current live kitchen preparation status */
  status: OrderStatus;

  /** Name of the campus cafeteria, e.g. "Cafe @7" */
  canteenName: string;

  /** Pickup slot label, e.g. "10:30 AM - 10:45 AM Morning Break" */
  slotLabel: string;

  /** Optional slot end time string (e.g. "10:45 AM" or ISO string) for live countdown */
  slotEndTime?: string;

  /** Total monetary amount in INR */
  totalAmount?: number;

  /** List of ordered items */
  items?: TrackedOrderItem[];

  /** Special dietary or preparation notes */
  notes?: string;

  /** 12-digit UPI Bank UTR reference if paid */
  utrNumber?: string;

  /** Custom QR code payload or URL (defaults to token URL) */
  qrPayload?: string;

  /** Optional callback fired when student clicks to view the full thermal receipt */
  onViewReceipt?: () => void;

  /** Optional callback when audio chimes are toggled */
  onToggleSound?: (enabled: boolean) => void;

  /** Initial sound enabled status (default: true) */
  soundEnabled?: boolean;

  /** Loading state flag (displays animated skeleton) */
  isLoading?: boolean;

  /** Error state message (displays defensive error card with retry button) */
  error?: string | null;

  /** Callback to retry loading on failure */
  onRetry?: () => void;

  /** Empty state flag (no active order found) */
  isEmpty?: boolean;

  /** Optional custom CSS classes for the container */
  className?: string;
}

/**
 * Visual styling and metadata for each order lifecycle step.
 */
export interface StepMetadata {
  key: OrderStatus;
  label: string;
  description: string;
  badgeColor: string;
  stepIndex: number;
}

