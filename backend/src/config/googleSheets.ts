import { google, sheets_v4 } from 'googleapis';

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

  const clientEmail = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    console.warn('[GoogleSheets] Missing GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY. Sheets logging will be skipped.');
    return null;
  }

  // Unescape literal \n in private key
  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  cachedSheetsClient = google.sheets({ version: 'v4', auth });
  return cachedSheetsClient;
}
