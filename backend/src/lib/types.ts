export type Category =
  | 'All'
  | 'Quick Bites'
  | 'Chaat Corner'
  | 'South Indian'
  | 'North Indian'
  | 'Sandwiches'
  | 'Momos & Burgers'
  | 'Fries & Pasta'
  | 'Garlic Bread & Pizza'
  | 'Maggi & Chinese'
  | 'Beverages'
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: Category | string;
  price: number;
  prepTime: number;
  tag: string;
  isVeg: boolean;
  isAvailable?: boolean;
  image?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COLLECTED'
  | 'CANCELLED';

export interface PickupSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBooked: number;
  availableSlots: number;
  isFull: boolean;
}

export interface OrderFinancials {
  itemTotal: number;
  studentPlatformFee: number; // ₹0
  paymentGatewayMdr: number;   // 0%
  totalAmountPaid: number;
  merchantPayoutAmount: number; // 88%
  platformShareAmount: number;  // 12%
}

export interface OrderCompliance {
  dpdpConsentGiven: boolean;
  fssaiLicense: string;
  maxSlotHoldMinutes: number; // 20 mins
}

export interface Order {
  id: string;
  orderToken: string;       // e.g. "FL-1793"
  pickupOtp: string;        // e.g. "6065"
  studentPhone?: string;
  studentName?: string;
  studentPrn?: string;
  items: CartItem[];
  slot: PickupSlot;
  totalAmount: number;
  utrNumber?: string;
  status: OrderStatus;
  notes?: string;
  financials?: OrderFinancials;
  compliance?: OrderCompliance;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    [key: string]: any;
  };
  error?: string;
}
