import { getSheetsClient } from '../config/googleSheets.js';
import { SheetLogRow } from '../lib/types.js';

const DEFAULT_TAB_NAME = 'NewAccounts';
const DEFAULT_FORM_LINK = 'https://forms.gle/ttYWWpCfpJhBqrVAA';

/**
 * Asynchronously appends a single row for a newly created student/user account
 * to the designated Google Sheet.
 *
 * FIRE-AND-FORGET: This operation is non-blocking and non-critical-path.
 * Any errors are caught and logged server-side without breaking the signup response.
 */
export async function logNewAccountToSheet(row: SheetLogRow): Promise<void> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) {
      console.warn('[AccountSheetLogger] GOOGLE_SHEETS_SPREADSHEET_ID is not configured. Skipping sheet logging.');
      return;
    }

    const sheets = getSheetsClient();
    if (!sheets) {
      console.warn('[AccountSheetLogger] Google Sheets client could not be initialized. Skipping sheet logging.');
      return;
    }

    const tabName = process.env.GOOGLE_SHEETS_TAB_NAME || DEFAULT_TAB_NAME;
    const formLink = row.formLink || process.env.ONBOARDING_FORM_LINK || DEFAULT_FORM_LINK;

    // Sanitize columns: ensure phone is empty string if not provided (never undefined/null)
    const sanitizedPhone = row.phone ? String(row.phone).trim() : '';

    const values = [
      [
        row.timestamp || new Date().toISOString(),
        row.name || '',
        row.email || '',
        sanitizedPhone,
        row.accountId || '',
        formLink,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A:F`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });

    console.log(`[AccountSheetLogger] Successfully logged new account (${row.email}) to Google Sheet [${tabName}]`);
  } catch (err: any) {
    // Non-blocking catch: swallow error and log server-side
    console.error('[AccountSheetLogger] Failed to append account row to Google Sheets:', err?.message || err);
  }
}
