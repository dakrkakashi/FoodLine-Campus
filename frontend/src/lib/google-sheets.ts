import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

let cachedAccessToken: { token: string; expiresAt: number } | null = null;
let usersCache: { data: any[]; cachedAt: number } | null = null;
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1UjpWRpsDuBx6aCsZLREx__zSapeEdICM3o7WosWZCW8';

function getCredentials(): { client_email: string; private_key: string } | null {
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
  const users = await getStudentUsers();
  return users.find(u => u.prn.toLowerCase() === clean || u.email.toLowerCase() === clean) || null;
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
  const row = [
    new Date().toISOString(),
    student.email.trim().toLowerCase(),
    student.name.trim(),
    student.prn.trim().toUpperCase(),
    student.email.trim().toLowerCase(),
    passHash,
    student.phone ? String(student.phone).trim() : '',
    'student'
  ];

  try {
    const range = encodeURIComponent("'FoodLine — Student Signup Form'!A:H");
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`, {
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
