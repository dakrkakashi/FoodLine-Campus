import { PasswordResetService } from '../src/services/password-reset.service.js';
import { SheetsDbService } from '../src/services/sheets-db.service.js';

async function runTest() {
  console.log('🧪 Starting End-to-End Password Recovery Flow Test...\n');

  const testPrn = '1031';
  const testOrigin = 'http://localhost:3000';

  // Step 1: Request Password Reset
  console.log('1️⃣ Requesting password reset for student PRN:', testPrn);
  const reqResult = await PasswordResetService.requestPasswordReset(testPrn, testOrigin);
  console.log('   Result:', reqResult);

  const token = reqResult.rawToken || reqResult.resetToken;
  if (!reqResult.success || !token) {
    throw new Error('Failed to generate reset token in test environment');
  }

  console.log('   Generated Token:', token);

  // Step 2: Verify the valid token
  console.log('\n2️⃣ Verifying valid token via verifyResetToken...');
  const verifyValid = await PasswordResetService.verifyResetToken(token);
  console.log('   Verification output:', verifyValid);
  if (!verifyValid.valid) {
    throw new Error('Expected token to be valid, but got invalid: ' + verifyValid.message);
  }

  // Step 3: Verify tampered token fails
  console.log('\n3️⃣ Verifying corrupted/tampered token fails...');
  const tamperedToken = token.slice(0, -4) + 'abcd';
  const verifyTampered = await PasswordResetService.verifyResetToken(tamperedToken);
  console.log('   Tampered token verification output:', verifyTampered);
  if (verifyTampered.valid) {
    throw new Error('Tampered token should have been rejected');
  }

  // Step 4: Execute Password Reset with valid token
  const testNewPassword = 'newPassword_2026!';
  console.log('\n4️⃣ Executing password reset with new password...');
  const resetResult = await PasswordResetService.executePasswordReset(token, testNewPassword);
  console.log('   Reset execution output:', resetResult);
  if (!resetResult.success) {
    throw new Error('Failed to execute password reset: ' + resetResult.message);
  }

  // Step 5: Verify replay attack fails (token must be single-use)
  console.log('\n5️⃣ Testing replay attack prevention (token re-use)...');
  const replayResult = await PasswordResetService.verifyResetToken(token);
  console.log('   Replay check output:', replayResult);
  if (replayResult.valid) {
    throw new Error('Token must not be valid after being used once!');
  }

  console.log('\n✅ ALL PASSWORD RECOVERY SECURITY & FUNCTIONAL TESTS PASSED SUCCESSFULLY!');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
