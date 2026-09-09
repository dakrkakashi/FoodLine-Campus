import { checkGoogleSheetsConnection } from '../src/config/googleSheets.js';
import { SheetsDbService } from '../src/services/sheets-db.service.js';

async function main() {
  console.log('Testing Google Sheets connection...');
  const res = await checkGoogleSheetsConnection();
  console.log('Result:', JSON.stringify(res, null, 2));

  if (res.connected) {
    console.log('\nTesting SheetsDbService.getUsers()...');
    const users = await SheetsDbService.getUsers(true);
    console.log('Users found:', users.length);

    console.log('\nTesting SheetsDbService.getPayments()...');
    const payments = await SheetsDbService.getPayments(true);
    console.log('Payments found:', payments.length);
  }

  process.exit(res.connected ? 0 : 1);
}

main().catch(console.error);
