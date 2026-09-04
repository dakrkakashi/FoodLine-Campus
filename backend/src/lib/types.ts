export type CategoryName =
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

export interface Category {
  id: string;
  name: string;
  icon?: string;
  display_order?: number;
}

export type InventoryType = 'daily_fresh' | 'persistent';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryName | string;
  category_id?: string;
  price: number;
  prepTime: number;
  prep_time_mins?: number;
  tag: string;
  isVeg: boolean;
  is_veg?: boolean;
  isAvailable?: boolean;
  is_available?: boolean;
  image?: string;
  image_url?: string;
  cafeteriaId?: string;
  cafeteria_id?: string;
  inventory_type?: InventoryType;
  stock_quantity?: number | null;
  low_stock_threshold?: number;
  last_fresh_date?: string;
  created_at?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  id?: string;
  name?: string;
  price?: number;
  category?: string;
  tag?: string;
  maxStock?: number | null;
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

export interface ToggleInventoryPayload {
  isAvailable: boolean;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAY_AT_COUNTER'
  | 'AWAITING_VERIFICATION'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COLLECTED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 'UPI' | 'COD';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id?: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
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
  isPast?: boolean;
  isClosed?: boolean;
  status?: 'OPEN' | 'FULL' | 'CLOSED_TIME_PASSED';
  cafeteriaId?: string;
  cafeteria_id?: string;
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
  order_token?: string;
  pickupOtp: string;        // e.g. "6065"
  pickup_otp?: string;
  userId?: string;
  user_id?: string;
  cafeteriaId?: string;
  cafeteria_id?: string;
  slot_id?: string;
  studentPhone?: string;
  studentName?: string;
  studentPrn?: string;
  items: CartItem[];
  order_items?: OrderItem[];
  slot: PickupSlot;
  totalAmount: number;
  total_amount?: number;
  paymentMethod?: PaymentMethod;
  payment_method?: PaymentMethod;
  utrNumber?: string;
  utr_number?: string;
  status: OrderStatus;
  notes?: string;
  counterId?: string;
  isSquadOrder?: boolean;
  squadRoomId?: string;
  idempotencyKey?: string;
  financials?: OrderFinancials;
  compliance?: OrderCompliance;
  pickup_slots?: {
    label: string;
    start_time?: string;
    end_time?: string;
  };
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  updated_at?: string;
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

export interface Payment {
  id: string;
  order_id: string;
  utr_number: string;
  amount: number;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'FAILED';
  verified_by?: string;
  created_at: string;
  verified_at?: string;
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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp?: string;
    requestId?: string;
    totalItems?: number;
    [key: string]: any;
  };
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
  studentPhone?: string;
  utrNumber?: string;
  cafeteriaId?: string;
}

export interface VerifyUtrPayload {
  orderToken: string;
  utrNumber: string; // 12 digits
  amount?: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
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

// --- WhatsApp Cloud API & Realtime Benchmark Contracts ---

export interface WhatsAppTemplateParameter {
  type: 'text' | 'currency' | 'date_time' | 'image';
  text?: string;
  [key: string]: any;
}

export interface WhatsAppTemplateComponent {
  type: 'header' | 'body' | 'button';
  sub_type?: 'url' | 'quick_reply';
  index?: number;
  parameters: WhatsAppTemplateParameter[];
}

export interface WhatsAppTemplateLanguage {
  code: string; // e.g. 'en', 'en_US', 'hi'
  policy?: 'deterministic';
}

export interface WhatsAppTemplatePayload {
  messaging_product: 'whatsapp';
  recipient_type?: 'individual';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: WhatsAppTemplateLanguage | { code: string };
    components: WhatsAppTemplateComponent[];
  };
}

export interface WhatsAppMessageResponse {
  messaging_product: 'whatsapp';
  contacts?: Array<{
    input: string;
    wa_id: string;
  }>;
  messages?: Array<{
    id: string;
    message_status?: 'accepted' | 'held_for_quality_assessment';
  }>;
}

export interface WhatsAppPickupTemplateParameters {
  orderToken: string;
  pickupOtp: string;
  studentName?: string;
  cafeteriaName?: string;
  totalAmount?: number;
  status?: OrderStatus | string;
  pickupSlotLabel?: string;
  readyTimestamp?: string;
}

export interface WhatsAppNotificationDispatchResult {
  success: boolean;
  orderToken: string;
  recipientPhone: string;
  channel: 'WHATSAPP';
  status: 'SENT' | 'FAILED' | 'SKIPPED' | 'MOCK_DISPATCHED';
  messageId?: string;
  latencyMs: number;
  error?: string;
  dispatchedAt: string;
}

export interface NotificationLog {
  id: string;
  orderToken: string;
  event: 'ORDER_READY' | 'ORDER_COLLECTED' | 'ORDER_CREATED' | 'WHATSAPP_DISPATCH';
  channel?: 'SSE' | 'WEBHOOK' | 'WHATSAPP';
  status: 'SENT' | 'FAILED' | 'SKIPPED' | 'MOCK_DISPATCHED';
  destination?: string;
  recipientPhone?: string;
  timestamp: string;
  latencyMs?: number;
  details?: Record<string, any>;
}

export interface WhatsAppTelemetryLog extends NotificationLog {
  templateName: string;
  languageCode: string;
  recipientPhone: string;
  otp: string;
  orderToken: string;
  httpStatus?: number;
  responsePayload?: Record<string, any>;
  errorMessage?: string;
}

export interface RealtimeBenchmarkMetrics {
  totalStreams: number;
  successfulConnections: number;
  failedConnections: number;
  avgConnectionLatencyMs: number;
  minConnectionLatencyMs: number;
  maxConnectionLatencyMs: number;
  avgBroadcastLatencyMs: number;
  p50BroadcastLatencyMs: number;
  p95BroadcastLatencyMs: number;
  p99BroadcastLatencyMs: number;
  packetsSent: number;
  packetsReceived: number;
  packetDropRatePercent: number;
  memoryDeltaRssMb: number;
  memoryDeltaHeapMb: number;
  durationMs: number;
}

export interface RealtimeBenchmarkResult {
  timestamp: string;
  targetConcurrency: number;
  supabaseRealtime: RealtimeBenchmarkMetrics;
  inMemorySse: RealtimeBenchmarkMetrics;
  winner: 'SUPABASE_REALTIME' | 'IN_MEMORY_SSE' | 'TIED';
  recommendation: string;
}

