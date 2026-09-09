import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

let cachedAccessToken: { token: string; expiresAt: number } | null = null;
let usersCache: { data: any[]; cachedAt: number } | null = null;
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1UjpWRpsDuBx6aCsZLREx__zSapeEdICM3o7WosWZCW8';

function getCredentials(): { client_email: string; private_key: string } | null {
  const envEmail = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let envKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
  if (envEmail && envKey) {
    if (envKey.includes('\\n')) {
      envKey = envKey.replace(/\\n/g, '\n');
    }
    return { client_email: envEmail, private_key: envKey };
  }

  const envJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (envJson) {
    try {
      const parsed = JSON.parse(envJson);
      if (parsed.client_email && parsed.private_key) {
        return { client_email: parsed.client_email, private_key: parsed.private_key };
      }
    } catch {}
  }

  const candidates = [
    path.resolve(process.cwd(), 'credentials.json'),
    path.resolve(process.cwd(), '../credentials.json'),
    path.resolve(process.cwd(), 'backend/credentials.json'),
    path.resolve(process.cwd(), '../backend/credentials.json'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      try {
        return JSON.parse(fs.readFileSync(c, 'utf-8'));
      } catch {}
    }
  }
  return null;
}

async function getAccessToken(): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60) {
    return cachedAccessToken.token;
  }

  const creds = getCredentials();
  if (!creds || !creds.client_email || !creds.private_key) {
    return null;
  }

  try {
    const jwtHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const jwtClaim = Buffer.from(JSON.stringify({
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    })).toString('base64url');

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(`${jwtHeader}.${jwtClaim}`);
    const signature = signer.sign(creds.private_key, 'base64url');
    const assertion = `${jwtHeader}.${jwtClaim}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
      cache: 'no-store'
    });

    const data = await res.json();
    if (data.access_token) {
      cachedAccessToken = {
        token: data.access_token,
        expiresAt: now + (data.expires_in || 3600)
      };
      return data.access_token;
    }
  } catch (e) {
    console.error('[google-sheets] Failed to acquire Google access token:', e);
  }
  return null;
}

export interface StudentSheetRecord {
  timestamp: string;
  name: string;
  prn: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: string;
}

export async function getStudentUsers(forceRefresh = false): Promise<StudentSheetRecord[]> {
  const now = Date.now();
  if (!forceRefresh && usersCache && now - usersCache.cachedAt < 20000) {
    return usersCache.data;
  }

  const token = await getAccessToken();
  if (!token) return [];

  try {
    const range = encodeURIComponent("'FoodLine — Student Signup Form'!A1:H");
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    const json = await res.json();
    const rows = json.values || [];
    if (rows.length < 2) return [];

    const headers = rows[0].map((h: any) => String(h || '').toLowerCase().trim());
    const tsIdx = headers.findIndex((h: string) => h.includes('timestamp'));
    const nameIdx = headers.findIndex((h: string) => h.includes('full name') || h.includes('name'));
    const prnIdx = headers.findIndex((h: string) => h.includes('prn') || h.includes('roll'));
    const emailIdx = headers.findIndex((h: string) => h.includes('college email') || h.includes('email'));
    const passIdx = headers.findIndex((h: string) => h.includes('password'));
    const phoneIdx = headers.findIndex((h: string) => h.includes('phone'));
    const roleIdx = headers.findIndex((h: string) => h.includes('role') || h.includes('column 7'));

    const records: StudentSheetRecord[] = rows.slice(1).map((row: any[]) => ({
      timestamp: String(row[tsIdx !== -1 ? tsIdx : 0] || ''),
      name: String(row[nameIdx !== -1 ? nameIdx : 2] || '').trim(),
      prn: String(row[prnIdx !== -1 ? prnIdx : 3] || '').trim().toUpperCase(),
      email: String(row[emailIdx !== -1 ? emailIdx : 1] || '').trim().toLowerCase(),
      passwordHash: String(row[passIdx !== -1 ? passIdx : 5] || '').trim(),
      phone: phoneIdx !== -1 && row[phoneIdx] ? String(row[phoneIdx]).trim() : undefined,
      role: roleIdx !== -1 && row[roleIdx] ? String(row[roleIdx]).trim().toLowerCase() : 'student',
    }));

    usersCache = { data: records, cachedAt: now };
    return records;
  } catch (err) {
    console.error('[google-sheets] Error fetching student users:', err);
    return usersCache ? usersCache.data : [];
  }
}

export async function findStudentUser(identifier: string): Promise<StudentSheetRecord | null> {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  const cleanNoZero = clean.replace(/^0+/, '');
  const users = await getStudentUsers();
  return users.find(u => {
    const uPrn = (u.prn || '').trim().toLowerCase();
    const uPrnNoZero = uPrn.replace(/^0+/, '');
    const uEmail = (u.email || '').trim().toLowerCase();

    // 1. Direct match on PRN or Email
    if (uPrn === clean || uEmail === clean) return true;

    // 2. Numeric PRN match ignoring leading zeroes (e.g. '0110' matches '110', '0118' matches '118')
    if (cleanNoZero && uPrnNoZero && cleanNoZero === uPrnNoZero) return true;

    // 3. College email alias match (e.g. 'student_0110@sanjivani.edu.in' or 'student_110@sanjivani.edu.in')
    if (uEmail === `student_${clean}@sanjivani.edu.in` || (cleanNoZero && uEmail === `student_${cleanNoZero}@sanjivani.edu.in`)) {
      return true;
    }
    if (uEmail.includes(`_${clean}@`) || (cleanNoZero && uEmail.includes(`_${cleanNoZero}@`))) {
      return true;
    }

    return false;
  }) || null;
}

export function verifyStudentPassword(inputPass: string, storedHash: string): boolean {
  if (!inputPass || !storedHash) return false;
  if (storedHash.startsWith('$sha256$')) {
    const rawHash = storedHash.replace('$sha256$', '');
    const computed = crypto.createHash('sha256').update(inputPass).digest('hex');
    return computed === rawHash;
  }
  // Legacy / Direct comparison
  const sha256Clean = crypto.createHash('sha256').update(inputPass + '_foodline_campus_2026').digest('hex');
  return inputPass === storedHash || sha256Clean === storedHash;
}

export async function appendStudentUser(student: {
  name: string;
  prn: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  const passHash = `$sha256$${crypto.createHash('sha256').update(student.password).digest('hex')}`;
  const cleanPrn = student.prn.trim().toUpperCase();
  // Prepend single quote so Google Sheets explicitly treats leading zeros as string text
  const prnValue = cleanPrn.startsWith("'") ? cleanPrn : `'${cleanPrn}`;
  const row = [
    new Date().toISOString(),
    student.email.trim().toLowerCase(),
    student.name.trim(),
    prnValue,
    student.email.trim().toLowerCase(),
    passHash,
    student.phone ? String(student.phone).trim() : '',
    'student'
  ];

  try {
    const range = encodeURIComponent("'FoodLine — Student Signup Form'!A:H");
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values: [row] }),
      cache: 'no-store'
    });
    usersCache = null; // Invalidate cache
    return res.ok;
  } catch (err) {
    console.error('[google-sheets] Error appending student:', err);
    return false;
  }
}

export async function appendPaymentRecord(payment: {
  timestamp?: string;
  email?: string;
  screenshotUrl?: string;
  fullName?: string;
  prn?: string;
  utr: string;
  orderToken: string;
  amount: number | string;
}): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) {
    console.warn('[google-sheets] No access token for payment record append');
    return false;
  }

  // Schema matching Google Sheet 'FoodLine — Payment & UTR Form':
  // [A] Timestamp | [B] Email Address | [C] Screenshot | [D] Full Name | [E] PRN / Roll Number | [F] 12-Digit Bank UTR / Reference No. | [G] Order ID / Token | [H] Amount Paid
  const cleanPrn = (payment.prn || 'CAMPUS_STUDENT').trim().toUpperCase();
  const cleanEmail = (payment.email || '').trim().toLowerCase() || `${cleanPrn.toLowerCase()}@sanjivani.edu.in`;
  const cleanName = (payment.fullName || 'Campus Student').trim();

  const row = [
    payment.timestamp || new Date().toISOString(),
    cleanEmail,
    payment.screenshotUrl || 'DIRECTPAY_UPI_VERIFIED',
    cleanName,
    cleanPrn,
    payment.utr.trim(),
    payment.orderToken.trim(),
    Number(payment.amount || 0).toFixed(2),
  ];

  try {
    const range = encodeURIComponent("'FoodLine — Payment & UTR Form'!A:H");
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values: [row] }),
      cache: 'no-store'
    });
    return res.ok;
  } catch (err) {
    console.error('[google-sheets] Error appending payment to Google Sheet:', err);
    return false;
  }
}

export async function appendOrderRecord(order: {
  orderToken: string;
  timestamp?: string;
  prn?: string;
  name?: string;
  itemsSummary: string;
  quantity: number;
  totalAmount: number;
  status: string;
  utr?: string;
}): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  // Schema: [A] OrderID | [B] Timestamp | [C] PRN | [D] Name | [E] Items | [F] Quantity | [G] TotalAmount | [H] Status | [I] PaymentUTR
  const row = [
    order.orderToken,
    order.timestamp || new Date().toISOString(),
    (order.prn || 'CAMPUS_STUDENT').trim().toUpperCase(),
    (order.name || 'Campus Student').trim(),
    order.itemsSummary,
    order.quantity,
    order.totalAmount,
    order.status,
    order.utr || ''
  ];

  try {
    const range = encodeURIComponent("'Orders'!A:I");
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values: [row] }),
      cache: 'no-store'
    });
    return res.ok;
  } catch (err) {
    console.error('[google-sheets] Error appending order to Orders tab:', err);
    return false;
  }
}

export async function updateStudentPassword(prn: string, newPassword: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  const cleanPrn = prn.trim().toUpperCase();
  const passHash = `$sha256$${crypto.createHash('sha256').update(newPassword).digest('hex')}`;

  try {
    const range = encodeURIComponent("'FoodLine — Student Signup Form'!A1:H");
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    const json = await res.json();
    const rows = json.values || [];
    if (rows.length < 2) return false;

    const headers = rows[0].map((h: any) => String(h || '').toLowerCase().trim());
    const prnIdx = headers.findIndex((h: string) => h.includes('prn') || h.includes('roll'));
    const passIdx = headers.findIndex((h: string) => h.includes('password'));

    const actualPrnIdx = prnIdx !== -1 ? prnIdx : 3;
    const actualPassIdx = passIdx !== -1 ? passIdx : 5;

    let targetRowNumber = -1;
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][actualPrnIdx] || '').trim().toUpperCase() === cleanPrn) {
        targetRowNumber = i + 1; // 1-based index in Google Sheets
        break;
      }
    }

    if (targetRowNumber !== -1) {
      const colLetter = String.fromCharCode(65 + actualPassIdx);
      const updateRange = encodeURIComponent(`'FoodLine — Student Signup Form'!${colLetter}${targetRowNumber}`);
      const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${updateRange}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [[passHash]] }),
        cache: 'no-store'
      });
      usersCache = null; // Invalidate cache
      return updateRes.ok;
    }
    return false;
  } catch (err) {
    console.error('[google-sheets] Error updating student password:', err);
    return false;
  }
}

