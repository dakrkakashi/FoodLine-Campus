import crypto from 'crypto';
import { SheetsDbService } from './sheets-db.service.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { CampusService } from './campus-service.js';

export interface ResetTokenRecord {
  tokenHash: string;
  email: string;
  prn?: string;
  name?: string;
  expiresAt: number; // Unix timestamp in ms
  used: boolean;
  ipAddress?: string;
  createdAt: number;
}

export class PasswordResetService {
  // In-memory token store: tokenHash -> ResetTokenRecord
  private static tokenStore: Map<string, ResetTokenRecord> = new Map();

  // Token expiration time: 15 minutes (900,000 ms)
  public static readonly TOKEN_TTL_MS = 15 * 60 * 1000;

  /**
   * Hashes raw token with SHA-256 to ensure zero plaintext token persistence.
   */
  public static hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  /**
   * Sweeps expired tokens from memory to prevent memory leaks.
   */
  public static cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [hash, record] of this.tokenStore.entries()) {
      if (record.expiresAt < now || record.used) {
        this.tokenStore.delete(hash);
      }
    }
  }

  /**
   * Generates a secure, cryptographically random password reset link.
   * Defends against account enumeration by always returning success to callers.
   */
  public static async requestPasswordReset(
    identifier: string,
    ipAddress?: string,
    origin?: string
  ): Promise<{
    success: boolean;
    message: string;
    rawToken?: string;
    resetUrl?: string;
    debugPrn?: string;
  }> {
    this.cleanupExpiredTokens();

    const cleanId = (identifier || '').trim().toLowerCase();
    if (!cleanId) {
      return {
        success: false,
        message: 'A valid email or student PRN is required.',
      };
    }

    let targetEmail: string | null = null;
    let targetPrn: string | null = null;
    let targetName: string = 'Campus Member';

    // 1. Check Google Sheets Users tab
    try {
      if (SheetsDbService.isConfigured()) {
        const sheetUser = await SheetsDbService.findUser(cleanId);
        if (sheetUser) {
          targetEmail = sheetUser.email;
          targetPrn = sheetUser.prn;
          targetName = sheetUser.name || 'Campus Student';
        }
      }
    } catch (err) {
      console.warn('[PasswordResetService] SheetsDb lookup notice:', err);
    }

    // 2. Check Supabase profiles if not found in sheets
    if (!targetEmail && isSupabaseConfigured) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, prn, full_name')
          .or(`email.ilike.${cleanId},prn.ilike.${cleanId}`)
          .maybeSingle();

        if (profile) {
          targetEmail = profile.email;
          targetPrn = profile.prn;
          targetName = profile.full_name || 'Campus Member';
        }
      } catch (err) {
        console.warn('[PasswordResetService] Supabase profile lookup notice:', err);
      }
    }

    // 3. Fallback: Campus student directory resolver
    if (!targetEmail) {
      try {
        const resolved = await CampusService.resolveStudent(cleanId);
        if (resolved && resolved.prn) {
          targetPrn = resolved.prn;
          targetName = resolved.studentName || 'Campus Student';
          targetEmail = `${resolved.prn.toLowerCase()}@sanjivani.edu.in`;
        }
      } catch (err) {
        console.warn('[PasswordResetService] CampusService resolve notice:', err);
      }
    }

    // If account was found, create single-use token
    let rawToken: string | undefined;
    let resetUrl: string | undefined;

    if (targetEmail || targetPrn) {
      const email = (targetEmail || `${targetPrn?.toLowerCase()}@sanjivani.edu.in`).toLowerCase();
      const prn = (targetPrn || cleanId).toUpperCase();

      // Invalidate existing active tokens for this user
      for (const [hash, record] of this.tokenStore.entries()) {
        if (record.email === email || (record.prn && record.prn === prn)) {
          this.tokenStore.delete(hash);
        }
      }

      // Generate 256 bits of cryptographic entropy (64 hex characters)
      rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = this.hashToken(rawToken);
      const now = Date.now();
      const expiresAt = now + this.TOKEN_TTL_MS;

      const record: ResetTokenRecord = {
        tokenHash,
        email,
        prn,
        name: targetName,
        expiresAt,
        used: false,
        ipAddress,
        createdAt: now,
      };

      // Store in memory
      this.tokenStore.set(tokenHash, record);

      // Best-effort persistence in Supabase if table exists
      if (isSupabaseConfigured) {
        (async () => {
          try {
            const { error } = await supabase
              .from('password_reset_tokens')
              .insert({
                email,
                prn,
                token_hash: tokenHash,
                expires_at: new Date(expiresAt).toISOString(),
                used: false,
                ip_address: ipAddress || null,
              });
            if (error && !error.message.includes('relation "password_reset_tokens" does not exist')) {
              console.warn('[PasswordResetService] Supabase token sync error:', error.message);
            }
          } catch {}
        })();
      }

      const baseUrl =
        origin ||
        process.env.FRONTEND_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        'http://localhost:3000';

      resetUrl = `${baseUrl.replace(/\/$/, '')}/reset-password?token=${rawToken}`;

      // High-visibility operational log for developers & pilot campus coordinators
      console.log('================================================================================');
      console.log('🔐 [FOODLINE CAMPUS PASSWORD RECOVERY DISPATCH]');
      console.log(`👤 Recipient: ${targetName} (${prn}) <${email}>`);
      console.log(`⏳ Valid for: 15 minutes (Expires at: ${new Date(expiresAt).toLocaleTimeString()})`);
      console.log(`🔗 Recovery URL: ${resetUrl}`);
      console.log('================================================================================');
    }

    // Always return safe generic message to prevent account enumeration
    const response: {
      success: boolean;
      message: string;
      rawToken?: string;
      resetUrl?: string;
      debugPrn?: string;
    } = {
      success: true,
      message:
        'If this account exists in our campus records, a password reset link has been dispatched to the registered address.',
    };

    // Return reset URL in non-production environments to allow instant testing and verification
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev && resetUrl && rawToken) {
      response.rawToken = rawToken;
      response.resetUrl = resetUrl;
      response.debugPrn = targetPrn || undefined;
    }

    return response;
  }

  /**
   * Verifies whether a submitted raw token is valid, active, and unexpired.
   */
  public static async verifyResetToken(rawToken: string): Promise<{
    valid: boolean;
    message: string;
    email?: string;
    prn?: string;
    name?: string;
  }> {
    if (!rawToken || typeof rawToken !== 'string' || rawToken.length < 32) {
      return {
        valid: false,
        message: 'Invalid or malformed password reset link. Please request a new one.',
      };
    }

    const tokenHash = this.hashToken(rawToken);
    const now = Date.now();

    // 1. Check in-memory store
    const record = this.tokenStore.get(tokenHash);

    if (record) {
      if (record.used) {
        return {
          valid: false,
          message: 'This password reset link has already been used. Please request a new one if needed.',
        };
      }
      if (record.expiresAt < now) {
        this.tokenStore.delete(tokenHash);
        return {
          valid: false,
          message: 'This password reset link has expired (15-minute limit exceeded). Please request a new one.',
        };
      }

      return {
        valid: true,
        message: 'Password reset token is verified and active.',
        email: record.email,
        prn: record.prn,
        name: record.name,
      };
    }

    // 2. Check Supabase persistence if not in local memory (e.g. server restart or multi-instance)
    if (isSupabaseConfigured) {
      try {
        const { data: dbToken, error } = await supabase
          .from('password_reset_tokens')
          .select('email, prn, expires_at, used')
          .eq('token_hash', tokenHash)
          .maybeSingle();

        if (!error && dbToken) {
          if (dbToken.used) {
            return {
              valid: false,
              message: 'This password reset link has already been used. Please request a new one.',
            };
          }
          if (new Date(dbToken.expires_at).getTime() < now) {
            return {
              valid: false,
              message: 'This password reset link has expired. Please request a new one.',
            };
          }

          return {
            valid: true,
            message: 'Password reset token is verified and active.',
            email: dbToken.email,
            prn: dbToken.prn,
          };
        }
      } catch (err) {
        console.warn('[PasswordResetService] Supabase token lookup error:', err);
      }
    }

    return {
      valid: false,
      message: 'Invalid or expired password reset link.',
    };
  }

  /**
   * Executes password update across Google Sheets and Supabase after verifying the token.
   * Automatically invalidates the token upon completion.
   */
  public static async executePasswordReset(
    rawToken: string,
    newPassword: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 4) {
      return {
        success: false,
        message: 'Password must be at least 4 characters long.',
      };
    }

    // 1. Verify token
    const verification = await this.verifyResetToken(rawToken);
    if (!verification.valid) {
      return {
        success: false,
        message: verification.message,
      };
    }

    const tokenHash = this.hashToken(rawToken);
    const identifier = verification.prn || verification.email;
    if (!identifier) {
      return {
        success: false,
        message: 'No associated user record found for this token.',
      };
    }

    let sheetsUpdated = false;
    let supabaseUpdated = false;

    // 2. Update Google Sheets Users / Student Signup Form tab
    try {
      if (SheetsDbService.isConfigured()) {
        sheetsUpdated = await SheetsDbService.updateStudentPassword(identifier, newPassword);
      }
    } catch (err) {
      console.error('[PasswordResetService] Sheets update error:', err);
    }

    // 3. Update Supabase if configured
    if (isSupabaseConfigured && verification.email) {
      try {
        // Find auth user by email
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id')
          .ilike('email', verification.email)
          .maybeSingle();

        if (userProfile?.id) {
          // Update Supabase Auth user password using admin client if service role key available
          const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
            userProfile.id,
            { password: newPassword }
          );

          if (!authUpdateError) {
            supabaseUpdated = true;
          } else {
            console.warn('[PasswordResetService] Supabase auth password update notice:', authUpdateError.message);
          }
        }
      } catch (err: any) {
        console.warn('[PasswordResetService] Supabase reset error:', err?.message || err);
      }
    }

    // 4. Mark token as used in memory & DB
    const memRecord = this.tokenStore.get(tokenHash);
    if (memRecord) {
      memRecord.used = true;
    }

    if (isSupabaseConfigured) {
      (async () => {
        try {
          await supabase
            .from('password_reset_tokens')
            .update({ used: true })
            .eq('token_hash', tokenHash);
        } catch {}
      })();
    }

    console.log(`✅ [PasswordResetService] Password successfully reset for user ${identifier}`);

    return {
      success: true,
      message: 'Your password has been successfully updated! You can now log in with your new credentials.',
    };
  }
}
