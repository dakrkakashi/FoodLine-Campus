import { google, sheets_v4 } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Multi-path dotenv resolution
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'frontend/.env.local') });

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

let cachedSheetsClient: sheets_v4.Sheets | null = null;

/**
 * Returns a lazily-cached Google Sheets API client singleton authenticated
 * via Google Service Account credentials.
 */
export function getSheetsClient(): sheets_v4.Sheets | null {
  if (cachedSheetsClient) {
    return cachedSheetsClient;
  }

  // 1. Check direct environment variables
  let clientEmail =
    process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL ||
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey =
    process.env.GOOGLE_SHEETS_PRIVATE_KEY ||
    process.env.GOOGLE_PRIVATE_KEY;

  // 2. Fallback: check credentials.json file if provided
  const credentialsPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.resolve(process.cwd(), 'backend/credentials.json');

  if ((!clientEmail || !privateKey) && fs.existsSync(credentialsPath)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      clientEmail = fileData.client_email;
      privateKey = fileData.private_key;
    } catch (e) {
      console.warn('[GoogleSheets] Failed to parse credentials.json:', e);
    }
  }

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Unescape literal \n in private key
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    const auth = fs.existsSync(credentialsPath)
      ? new google.auth.GoogleAuth({
          keyFile: credentialsPath,
          scopes: SCOPES,
        })
      : new google.auth.GoogleAuth({
          credentials: {
            client_email: clientEmail,
            private_key: privateKey,
          },
          scopes: SCOPES,
        });

    cachedSheetsClient = google.sheets({ version: 'v4', auth });
    return cachedSheetsClient;
  } catch (err: any) {
    console.error('[GoogleSheets] Failed to create Google Sheets auth client:', err?.message || err);
    return null;
  }
}

/**
 * Test connectivity to Google Sheets spreadsheet
 */
export async function checkGoogleSheetsConnection(): Promise<{
  connected: boolean;
  message: string;
  tabs?: string[];
  latencyMs: number;
}> {
  const start = Date.now();
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!sheets || !spreadsheetId) {
    return {
      connected: false,
      message: 'Google Sheets credentials or GOOGLE_SHEETS_SPREADSHEET_ID not configured.',
      latencyMs: 0,
    };
  }

  try {
    const res = await sheets.spreadsheets.get({ spreadsheetId });
    const tabs = (res.data.sheets || []).map((s) => s.properties?.title || 'Unknown');
    return {
      connected: true,
      message: `Google Sheets connected successfully to "${res.data.properties?.title || 'FoodLine Database'}"`,
      tabs,
      latencyMs: Date.now() - start,
    };
  } catch (err: any) {
    if (err.response?.data) {
      console.error('Google Sheets Error Detail:', JSON.stringify(err.response.data, null, 2));
    }
    return {
      connected: false,
      message: `Google Sheets connection failed: ${err.message}`,
      latencyMs: Date.now() - start,
    };
  }
}
