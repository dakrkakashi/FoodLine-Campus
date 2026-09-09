import { getSheetsClient } from '../src/config/googleSheets.js';
import { SheetsDbService } from '../src/services/sheets-db.service.js';

async function check() {
  const sheets = getSheetsClient();
  const id = SheetsDbService.getSpreadsheetId();
  
  if (!sheets) {
    console.error('No sheets client available');
    process.exit(1);
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: 'Orders!A1:I5',
  });
  console.log('ORDERS TAB ROWS IN GOOGLE SHEETS:');
  console.log(JSON.stringify(res.data.values, null, 2));
  process.exit(0);
}

check().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
