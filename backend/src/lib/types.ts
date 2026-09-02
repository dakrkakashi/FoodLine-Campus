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
  cafeteriaId?: string;
  cafeteria_id?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'AWAITING_VERIFICATION'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COLLECTED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface PickupSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentBooked: number;
  availableSlots: number;
  isFull: boolean;
  cafeteriaId?: string;
  facultyReserved?: number;
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
  maxSlotHoldMinutes: number; // 10-20 mins
}

export interface Order {
  id: string;
  orderToken: string;       // e.g. "FL-1793"
  pickupOtp: string;        // e.g. "6065"
  userId?: string;
  cafeteriaId?: string;
  studentPhone?: string;
  studentName?: string;
  studentPrn?: string;
  items: CartItem[];
  slot: PickupSlot;
  totalAmount: number;
  utrNumber?: string;
  status: OrderStatus;
  notes?: string;
  counterId?: string;
  isSquadOrder?: boolean;
  squadRoomId?: string;
  idempotencyKey?: string;
  financials?: OrderFinancials;
  compliance?: OrderCompliance;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  utrNumber: string;
  amount: number;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'FAILED' | 'REFUNDED';
  verificationMethod: 'UTR_MANUAL' | 'SOUNDBOX_WEBHOOK' | 'CASHIER_SCAN' | 'UPI_INTENT';
  verifiedBy?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface SlotHoldRecord {
  id: string;
  orderId: string;
  slotId: string;
  quantity: number;
  expiresAt: string;
  isReleased: boolean;
  createdAt: string;
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

export interface SignupRequestDTO {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface SheetLogRow {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  accountId: string;
  formLink: string;
}

export interface Campus {
  id: string;
  name: string;
  slug: string;
  location: string;
  state?: string;
  district?: string;
  city_town?: string;
  pincode?: string;
  totalCanteens?: number;
  isVerified?: boolean;
}

export interface Canteen {
  id: string;
  campus_id?: string;
  name: string;
  slug: string;
  tagline?: string;
  location: string;
  upi_id?: string;
  upiId?: string;
  is_pure_veg?: boolean;
  isPureVeg?: boolean;
  is_active?: boolean;
  isOpen?: boolean;
  prep_time_mins?: number;
  prepTimeMins?: number;
  activeSlotsCount?: number;
  dishesCount?: number;
  image_url?: string;
  imageUrl?: string;
}

export interface CampusGeoCity {
  id: string;
  name: string;
  campuses: Campus[];
}

export interface CampusGeoDistrict {
  id: string;
  name: string;
  cities: CampusGeoCity[];
}

export interface CampusGeoState {
  id: string;
  name: string;
  districts: CampusGeoDistrict[];
}

export interface CampusGeoHierarchy {
  states: CampusGeoState[];
}

export interface ResolvedStudentProfile {
  studentName?: string;
  prn: string;
  campus: Campus;
  defaultCafeteriaId?: string;
}

