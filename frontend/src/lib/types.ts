/**
 * 🚀 FoodLine Shared Type Definitions & API Contracts
 * Single source of truth for Antigravity IDE (Backend) and Antigravity CLI 'agy' (Frontend)
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp?: string;
    requestId?: string;
    totalItems?: number;
  };
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  display_order?: number;
}

export type InventoryType = 'daily_fresh' | 'persistent';

export interface MenuItem {
  id: string;
  cafeteria_id?: string;
  category_id?: string;
  category?: string;
  name: string;
  tag?: string;
  price: number;
  prep_time_mins?: number;
  prepTime?: number;
  is_available?: boolean;
  isAvailable?: boolean;
  inventory_type?: InventoryType;
  stock_quantity?: number | null;
  low_stock_threshold?: number;
  last_fresh_date?: string;
  image_url?: string;
  image?: string;
  created_at?: string;
}

export interface InventoryStatus {
  itemId: string;
  name?: string;
  price?: number;
  category?: string;
  tag?: string;
  inventoryType: InventoryType;
  isAvailable: boolean;
  stockQuantity?: number | null;
  isLowStock: boolean;
  lowStockThreshold?: number;
  lastFreshDate?: string;
}

export interface MorningPrepPayload {
  date: string; // 'YYYY-MM-DD'
  dailyFreshItemIds: string[];
}

export interface PersistentStockUpdate {
  itemId: string;
  stockQuantity: number;
}

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

export type PaymentMethod = 'UPI' | 'COD';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAY_AT_COUNTER'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COLLECTED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id?: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_token?: string; // e.g. "FL-1793"
  orderToken?: string;
  user_id?: string;
  studentPhone?: string;
  cafeteria_id?: string;
  slot_id?: string;
  slot?: PickupSlot;
  total_amount?: number;
  totalAmount?: number;
  payment_method?: PaymentMethod;
  paymentMethod?: PaymentMethod;
  status: OrderStatus;
  pickup_otp?: string; // e.g. "6065"
  pickupOtp?: string;
  utr_number?: string;
  utrNumber?: string;
  notes?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  items?: CartItem[];
  order_items?: OrderItem[];
  financials?: {
    itemTotal: number;
    studentPlatformFee: number; // 3.5%
    paymentGatewayMdr: number;   // 0%
    totalAmountPaid: number;
    merchantPayoutAmount: number;
    platformShareAmount: number;
  };
  compliance?: {
    dpdpConsentGiven: boolean;
    fssaiLicense: string;
    maxSlotHoldMinutes: number; // 20 mins
  };
  pickup_slots?: {
    label: string;
    start_time?: string;
    end_time?: string;
  };
}

export interface Payment {
  id: string;
  order_id: string;
  utr_number: string; // 12-digit numeric
  amount: number;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'FAILED';
  verified_by?: string;
  created_at: string;
  verified_at?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  tag?: string;
}

export interface CreateOrderPayload {
  slotId?: string;
  items: {
    id?: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  notes?: string;
  paymentMethod?: PaymentMethod;
  studentName?: string;
  studentPrn?: string;
  utrNumber?: string;
}

export interface VerifyUtrPayload {
  orderToken: string;
  utrNumber: string; // 12 digits
  amount?: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface ToggleInventoryPayload {
  isAvailable: boolean;
}

export interface SoundSettings {
  enabled: boolean;
  volume: number;
  lang: 'en-IN' | 'hi-IN' | 'mr-IN';
}

export interface DisplayOrder extends Order {
  order_items: OrderItem[];
  estimatedReadyAt?: string;
  counter?: 1 | 2;
  isJustReady?: boolean;
}

export type UserRole = 'student' | 'kitchen' | 'canteen_manager' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  prn?: string;
  department?: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  campus_id?: string;
  cafeteria_id?: string;
  last_login_at?: string;
  created_at?: string;
}

export interface StaffInvitation {
  id: string;
  email: string;
  role: 'kitchen' | 'canteen_manager';
  campus_id: string;
  cafeteria_id: string;
  invited_by?: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expires_at: string;
  created_at: string;
  accepted_at?: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_email?: string;
  action: string;
  target_type?: 'user' | 'menu_item' | 'slot' | 'order' | 'invitation' | 'financial';
  target_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
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

