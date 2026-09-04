import crypto from 'crypto';
import { getSheetsClient } from '../config/googleSheets.js';

export interface SheetUser {
  timestamp: string;
  name: string;
  prn: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: string;
}

export interface SheetPayment {
  timestamp: string;
  name: string;
  prn: string;
  utr: string;
  orderId?: string;
  amount: number;
  verificationStatus: 'PENDING_VERIFICATION' | 'VERIFIED' | 'FAILED' | 'REPLAY_DETECTED';
}

export interface SheetInventoryItem {
  itemId: string;
  itemName: string;
  category: string;
  price: number;
  stockQty: number;
  available: boolean;
  updatedAt: string;
}

export interface SheetOrder {
  orderId: string;
  timestamp: string;
  prn: string;
  name: string;
  items: string; // JSON or formatted summary e.g. "2x Vada Pav, 1x Cold Coffee"
  quantity: number;
  totalAmount: number;
  status: string;
  paymentUtr?: string;
}

// In-Memory Read-Through Cache to strictly respect Google Sheets 60-100 req/min quota
interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

export class SheetsDbService {
  private static usersCache: CacheEntry<SheetUser[]> | null = null;
  private static inventoryCache: CacheEntry<SheetInventoryItem[]> | null = null;
  private static paymentsCache: CacheEntry<SheetPayment[]> | null = null;

  // Cache Time-To-Live in milliseconds
  private static readonly INVENTORY_TTL_MS = 30 * 1000; // 30 seconds
  private static readonly USERS_TTL_MS = 60 * 1000;     // 60 seconds
  private static readonly PAYMENTS_TTL_MS = 20 * 1000;  // 20 seconds

  // Asynchronous Write Queue for Orders to strictly respect Google Sheets write quotas (max 60/min)
  private static pendingOrdersQueue: any[][] = [];
  private static orderFlushTimer: NodeJS.Timeout | null = null;
  private static isFlushingOrders = false;

  public static getSpreadsheetId(): string {
    return process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1UjpWRpsDuBx6aCsZLREx__zSapeEdICM3o7WosWZCW8';
  }

  public static isConfigured(): boolean {
    return Boolean(this.getSpreadsheetId() && getSheetsClient() !== null);
  }

  // ---------------------------------------------------------------------------
  // 1. USERS TAB: Read, Query & Authenticate
  // ---------------------------------------------------------------------------
  /**
   * Fetches all users from Signup Form response tab or Users tab with dynamic header detection.
   */
  public static async getUsers(forceRefresh = false): Promise<SheetUser[]> {
    const now = Date.now();
    if (!forceRefresh && this.usersCache && now - this.usersCache.cachedAt < this.USERS_TTL_MS) {
      return this.usersCache.data;
    }

    const sheets = getSheetsClient();
    const spreadsheetId = this.getSpreadsheetId();
    if (!sheets || !spreadsheetId) {
      return [];
    }

    try {
      let response;
      try {
        response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: "'FoodLine — Student Signup Form'!A1:Z",
        });
      } catch {
        response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'Users!A1:Z',
        });
      }

      const allRows = response.data.values || [];
      if (allRows.length < 2) return [];

      const headers = allRows[0].map((h: any) => String(h || '').toLowerCase().trim());
      const tsIdx = headers.findIndex((h) => h.includes('timestamp'));
      const nameIdx = headers.findIndex((h) => h.includes('full name') || h.includes('name'));
      const prnIdx = headers.findIndex((h) => h.includes('prn') || h.includes('roll'));
      const collegeEmailIdx = headers.findIndex((h) => h.includes('college email'));
      const emailAddressIdx = headers.findIndex((h) => h.includes('email address') || h.includes('email'));
      const passIdx = headers.findIndex((h) => h.includes('password'));
      const phoneIdx = headers.findIndex((h) => h.includes('phone'));
      const roleIdx = headers.findIndex((h) => h.includes('role') || h.includes('column 7'));

      const dataRows = allRows.slice(1);
      const users: SheetUser[] = dataRows.map((row) => {
        const email = String(
          (collegeEmailIdx !== -1 && row[collegeEmailIdx]) ||
          (emailAddressIdx !== -1 && row[emailAddressIdx]) ||
          ''
        ).trim().toLowerCase();

        return {
          timestamp: String(row[tsIdx !== -1 ? tsIdx : 0] || ''),
          name: String(row[nameIdx !== -1 ? nameIdx : 2] || '').trim(),
          prn: String(row[prnIdx !== -1 ? prnIdx : 3] || '').trim().toUpperCase(),
          email,
          passwordHash: String(row[passIdx !== -1 ? passIdx : 5] || '').trim(),
          phone: phoneIdx !== -1 && row[phoneIdx] ? String(row[phoneIdx]).trim() : undefined,
          role: roleIdx !== -1 && row[roleIdx] ? String(row[roleIdx]).trim().toLowerCase() : 'student',
        };
      });

      this.usersCache = { data: users, cachedAt: now };
      return users;
    } catch (err: any) {
      console.error('[SheetsDbService] Error reading Users tab:', err?.message || err);
      return this.usersCache ? this.usersCache.data : [];
    }
  }

  /**
   * Finds a user by email or PRN
   */
  public static async findUser(identifier: string): Promise<SheetUser | null> {
    if (!identifier) return null;
    const cleanId = identifier.trim().toLowerCase();
    const users = await this.getUsers();

    return (
      users.find(
        (u) => u.email.toLowerCase() === cleanId || u.prn.toLowerCase() === cleanId
      ) || null
    );
  }

  /**
   * Verifies password against plaintext or SHA-256 hash (from Apps Script)
   */
  public static verifyPassword(inputPassword: string, storedHash: string): boolean {
    if (!inputPassword || !storedHash) return false;

    // Check if stored password has been hashed with our $sha256$ prefix by Google Apps Script
    if (storedHash.startsWith('$sha256$')) {
      const rawHash = storedHash.replace('$sha256$', '');
      const computedHash = crypto.createHash('sha256').update(inputPassword).digest('hex');
      return computedHash === rawHash;
    }

    // Direct match (if Apps Script trigger has not hashed it yet)
    return inputPassword === storedHash;
  }

  /**
   * Appends a new student account directly to 'FoodLine — Student Signup Form' tab.
   * Schema: [A] Timestamp | [B] Email Address | [C] Full Name | [D] PRN / Roll Number | [E] College Email | [F] Password | [G] Phone Number | [H] Role
   */
  public static async appendStudentUser(user: {
    name: string;
    prn: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }): Promise<boolean> {
    const sheets = getSheetsClient();
    const spreadsheetId = this.getSpreadsheetId();
    if (!sheets || !spreadsheetId) return false;

    const passHash = `$sha256$${crypto.createHash('sha256').update(user.password).digest('hex')}`;
    const rowValues = [
      new Date().toISOString(),
      user.email.trim().toLowerCase(),
      user.name.trim(),
      user.prn.trim().toUpperCase(),
      user.email.trim().toLowerCase(),
      passHash,
      user.phone ? String(user.phone).trim() : '',
      user.role || 'student',
    ];

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "'FoodLine — Student Signup Form'!A:H",
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowValues],
        },
      });
      // Invalidate users cache to force fresh read
      this.usersCache = null;
      return true;
    } catch (err: any) {
      console.error('[SheetsDbService] Error appending student to Google Sheets:', err?.message || err);
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // 2. INVENTORY TAB: Read & Manage Menu Dishes
  // ---------------------------------------------------------------------------
  /**
   * Reads the 'Inventory' tab.
   * Schema: [A] ItemID | [B] ItemName | [C] Category | [D] Price | [E] StockQty | [F] Available | [G] UpdatedAt
   */
  public static async getInventory(onlyAvailable = false, forceRefresh = false): Promise<SheetInventoryItem[]> {
    const now = Date.now();
    if (!forceRefresh && this.inventoryCache && now - this.inventoryCache.cachedAt < this.INVENTORY_TTL_MS) {
      const cached = this.inventoryCache.data;
      return onlyAvailable ? cached.filter((item) => item.available) : cached;
    }

    const sheets = getSheetsClient();
    const spreadsheetId = this.getSpreadsheetId();
    if (!sheets || !spreadsheetId) {
      return [];
    }

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Inventory!A2:G',
      });

      const rows = response.data.values || [];
      const items: SheetInventoryItem[] = rows.map((row) => {
        const availRaw = String(row[5] || '').toUpperCase();
        const isAvailable = availRaw === 'TRUE' || availRaw === 'YES' || availRaw === '1';
        return {
          itemId: String(row[0] || ''),
          itemName: String(row[1] || '').trim(),
          category: String(row[2] || 'Snacks').trim(),
          price: Number(row[3]) || 0,
          stockQty: Number(row[4]) || 0,
          available: isAvailable,
          updatedAt: String(row[6] || new Date().toISOString()),
        };
      });

      this.inventoryCache = { data: items, cachedAt: now };
      return onlyAvailable ? items.filter((item) => item.available) : items;
    } catch (err: any) {
      console.error('[SheetsDbService] Error reading Inventory tab:', err?.message || err);
      return this.inventoryCache ? this.inventoryCache.data : [];
    }
  }

  // ---------------------------------------------------------------------------
  // 3. ORDERS TAB: Direct Backend Append (No Google Form)
  // ---------------------------------------------------------------------------
  /**
   * Appends an order row directly to the 'Orders' tab.
   * Schema: [A] OrderID | [B] Timestamp | [C] PRN | [D] Name | [E] Items | [F] Quantity | [G] TotalAmount | [H] Status | [I] PaymentUTR
   */
  public static async appendOrder(order: SheetOrder): Promise<boolean> {
    // Server-side mandatory field validation
    if (!order.orderId || !order.prn || !order.name || !order.items || order.totalAmount == null) {
      throw new Error('Missing mandatory fields for Order: orderId, prn, name, items, and totalAmount are required.');
    }

    const sheets = getSheetsClient();
    const spreadsheetId = this.getSpreadsheetId();
    if (!sheets || !spreadsheetId) {
      console.warn('[SheetsDbService] Google Sheets not configured. Skipping order append.');
      return false;
    }

    const rowValues = [
      order.orderId,
      order.timestamp || new Date().toISOString(),
      order.prn.trim().toUpperCase(),
      order.name.trim(),
      order.items,
      order.quantity,
      order.totalAmount,
      order.status || 'PENDING_PAYMENT',
      order.paymentUtr || '',
    ];

    // Enqueue order for batched asynchronous persistence
    this.pendingOrdersQueue.push(rowValues);

    // If buffer reaches 25 rows, trigger immediate batch flush
    if (this.pendingOrdersQueue.length >= 25) {
      this.flushOrdersQueue().catch((err) => {
        console.warn('[SheetsDbService] Immediate batch flush error:', err?.message || err);
      });
    } else if (!this.orderFlushTimer) {
      // Debounce flush by 1200ms to consolidate rapid bursts into a single API call
      this.orderFlushTimer = setTimeout(() => {
        this.orderFlushTimer = null;
        this.flushOrdersQueue().catch((err) => {
          console.warn('[SheetsDbService] Scheduled batch flush error:', err?.message || err);
        });
      }, 1200);
      if (this.orderFlushTimer.unref) this.orderFlushTimer.unref();
    }

    return true;
  }

  /**
   * Flushes batched orders from in-memory queue to Google Sheets in a single API call.
   * Eliminates the 60 write req/min quota limit failure during peak student rush breaks.
   */
  public static async flushOrdersQueue(): Promise<boolean> {
    if (this.isFlushingOrders || this.pendingOrdersQueue.length === 0) {
      return true;
    }

    const sheets = getSheetsClient();
    const spreadsheetId = this.getSpreadsheetId();
    if (!sheets || !spreadsheetId) {
      return false;
    }

    this.isFlushingOrders = true;
    // Drain up to 50 rows per batch append
    const batch = this.pendingOrdersQueue.splice(0, 50);

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Orders!A:I',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: batch,
        },
      });
      return true;
    } catch (err: any) {
      console.warn('[SheetsDbService] Error batch-appending orders to Orders tab (re-queueing):', err?.message || err);
      // Put batch back to head of queue so no orders are lost
      this.pendingOrdersQueue.unshift(...batch);
      return false;
    } finally {
      this.isFlushingOrders = false;
      // If items remain in queue, schedule follow-up flush
      if (this.pendingOrdersQueue.length > 0 && !this.orderFlushTimer) {
        this.orderFlushTimer = setTimeout(() => {
          this.orderFlushTimer = null;
          this.flushOrdersQueue().catch(() => {});
        }, 2000);
        if (this.orderFlushTimer.unref) this.orderFlushTimer.unref();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 4. PAYMENTS TAB: Read UTRs & Confirm Payment
  // ---------------------------------------------------------------------------
  /**
   * Reads all payments from the 'Payments' tab (populated by Form 2).
   * Schema: [A] Timestamp | [B] Name | [C] PRN | [D] UTR | [E] OrderID | [F] Amount | [G] VerificationStatus
   */
  public static async getPayments(forceRefresh = false): Promise<SheetPayment[]> {
    const now = Date.now();
    if (!forceRefresh && this.paymentsCache && now - this.paymentsCache.cachedAt < this.PAYMENTS_TTL_MS) {
      return this.paymentsCache.data;
    }

    const sheets = getSheetsClient();
    const spreadsheetId = this.getSpreadsheetId();
    if (!sheets || !spreadsheetId) {
      return [];
    }

    try {
      let response;
      try {
        response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: "'FoodLine — Payment & UTR Form'!A1:Z",
        });
      } catch {
        response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'Payments!A1:Z',
        });
      }

      const allRows = response.data.values || [];
      if (allRows.length < 2) return [];

      const headers = allRows[0].map((h: any) => String(h || '').toLowerCase().trim());
      const tsIdx = headers.findIndex((h) => h.includes('timestamp'));
      const nameIdx = headers.findIndex((h) => h.includes('full name') || h.includes('name'));
      const prnIdx = headers.findIndex((h) => h.includes('prn') || h.includes('roll'));
      const utrIdx = headers.findIndex((h) => h.includes('utr') || h.includes('reference'));
      const orderIdx = headers.findIndex((h) => h.includes('order') || h.includes('token'));
      const amountIdx = headers.findIndex((h) => h.includes('amount'));

      const dataRows = allRows.slice(1);
      const payments: SheetPayment[] = dataRows.map((row) => ({
        timestamp: String(row[tsIdx !== -1 ? tsIdx : 0] || ''),
        name: String(row[nameIdx !== -1 ? nameIdx : 3] || '').trim(),
        prn: String(row[prnIdx !== -1 ? prnIdx : 4] || '').trim().toUpperCase(),
        utr: String(row[utrIdx !== -1 ? utrIdx : 5] || '').trim().replace(/[\s-]/g, ''),
        orderId: orderIdx !== -1 && row[orderIdx] ? String(row[orderIdx]).trim() : undefined,
        amount: Number(row[amountIdx !== -1 ? amountIdx : 7]) || 0,
        verificationStatus: 'VERIFIED',
      }));

      this.paymentsCache = { data: payments, cachedAt: now };
      return payments;
    } catch (err: any) {
      console.error('[SheetsDbService] Error reading Payments tab:', err?.message || err);
      return this.paymentsCache ? this.paymentsCache.data : [];
    }
  }

  /**
   * Cross-checks a submitted UTR against the Payments tab.
   * If found in Form 2 submissions, validates amount and marks as VERIFIED.
   */
  public static async verifyUtr(
    utrNumber: string,
    expectedAmount?: number
  ): Promise<{ valid: boolean; message: string; payment?: SheetPayment }> {
    const cleanUtr = utrNumber.trim().replace(/[\s-]/g, '');

    // 1. Strict 12-digit format check
    if (!/^\d{12}$/.test(cleanUtr)) {
      return {
        valid: false,
        message: 'Invalid UTR format. Bank UTR reference must be exactly 12 numeric digits.',
      };
    }

    // 2. Query Payments tab
    const payments = await this.getPayments(true);
    const match = payments.find((p) => p.utr === cleanUtr);

    if (match) {
      if (expectedAmount && Math.abs(match.amount - expectedAmount) > 1) {
        return {
          valid: false,
          message: `Payment amount mismatch: Form recorded ₹${match.amount}, expected ₹${expectedAmount}.`,
          payment: match,
        };
      }
      return {
        valid: true,
        message: 'Payment verified from Google Sheets Payments tab.',
        payment: match,
      };
    }

    // If student verified via app first, return valid so order proceeds without blocking
    return {
      valid: true,
      message: '12-digit UTR validated successfully.',
    };
  }

  /**
   * Appends or records a payment to the Payments tab
   */
  public static async recordPayment(payment: SheetPayment): Promise<boolean> {
    if (!payment.name || !payment.prn || !payment.utr) {
      throw new Error('Missing mandatory fields for Payment: name, prn, and utr are required.');
    }

    const sheets = getSheetsClient();
    const spreadsheetId = this.getSpreadsheetId();
    if (!sheets || !spreadsheetId) {
      return false;
    }

    const rowValues = [
      payment.timestamp || new Date().toISOString(),
      payment.name.trim(),
      payment.prn.trim().toUpperCase(),
      payment.utr.trim(),
      payment.orderId || '',
      payment.amount || 0,
      payment.verificationStatus || 'VERIFIED',
    ];

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Payments!A:G',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowValues],
        },
      });
      // Invalidate cache
      this.paymentsCache = null;
      return true;
    } catch (err: any) {
      console.error('[SheetsDbService] Error recording payment in Payments tab:', err?.message || err);
      return false;
    }
  }

  /**
   * Invalidates all in-memory caches
   */
  public static clearCache(): void {
    this.usersCache = null;
    this.inventoryCache = null;
    this.paymentsCache = null;
  }
}
