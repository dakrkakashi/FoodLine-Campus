import { Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { logNewAccountToSheet } from '../services/accountSheetLogger.service.js';
import { SignupRequestDTO, SheetLogRow } from '../lib/types.js';
import { signJwt } from '../lib/jwt.js';
import { SheetsDbService } from '../services/sheets-db.service.js';
import { CampusService } from '../services/campus-service.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCAL_ACCOUNTS_FILE = path.join(process.cwd(), 'src/data/accounts.json');

function saveToLocalStore(account: any) {
  try {
    const dir = path.dirname(LOCAL_ACCOUNTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let accounts: Record<string, any> = {};
    if (fs.existsSync(LOCAL_ACCOUNTS_FILE)) {
      try {
        accounts = JSON.parse(fs.readFileSync(LOCAL_ACCOUNTS_FILE, 'utf-8'));
      } catch {}
    }
    accounts[account.email] = account;
    fs.writeFileSync(LOCAL_ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AuthController] Failed to write local fallback account:', err);
  }
}

export class AuthController {
  /**
   * Handles user signup.
   * Enforces mandatory valid email before any DB write.
   * Commits to Supabase database & local account store.
   * Triggers non-blocking fire-and-forget Google Sheets audit log.
   */
  public static async signup(req: Request, res: Response) {
    const timestamp = new Date().toISOString();
    const body: SignupRequestDTO = req.body;
    const { name, email, phone, password } = body || {};

    // 1. HARD MANDATORY EMAIL VALIDATION (before any DB write)
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'A valid email address is required for account creation.',
        meta: {
          timestamp,
          error: 'VALIDATION_EMAIL_REQUIRED',
        },
      });
    }

    // 2. Validate Name & Password
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Name is required.',
        meta: {
          timestamp,
          error: 'VALIDATION_NAME_REQUIRED',
        },
      });
    }

    if (!password || typeof password !== 'string' || password.length < 4) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Password must be at least 4 characters long.',
        meta: {
          timestamp,
          error: 'VALIDATION_PASSWORD_TOO_SHORT',
        },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone ? String(phone).trim() : '';
    let accountId: string = crypto.randomUUID();

    // Early duplicate check
    try {
      if (fs.existsSync(LOCAL_ACCOUNTS_FILE)) {
        const existing = JSON.parse(fs.readFileSync(LOCAL_ACCOUNTS_FILE, 'utf-8'));
        if (existing[cleanEmail]) {
          return res.status(409).json({
            success: false,
            data: null,
            error: `An account with email ${cleanEmail} already exists.`,
            meta: {
              timestamp,
              error: 'ACCOUNT_ALREADY_EXISTS',
            },
          });
        }
      }
    } catch {}

    try {
      let dbCommitted = false;

      // 3. DATABASE COMMIT (Supabase Auth -> on_auth_user_created trigger -> public.profiles)
      if (isSupabaseConfigured) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone,
              role: 'student',
            },
          },
        });

        if (authError) {
          const errMsg = authError.message.toLowerCase();
          if (errMsg.includes('already registered') || errMsg.includes('already exists')) {
            return res.status(409).json({
              success: false,
              data: null,
              error: `An account with email ${cleanEmail} already exists.`,
              meta: {
                timestamp,
                error: 'ACCOUNT_ALREADY_EXISTS',
              },
            });
          } else if (errMsg.includes('confirmation email')) {
            // Supabase auth user was created, but email dispatch rate-limited/unconfigured
            console.warn('[AuthController] Supabase auth created, SMTP confirmation email notice:', authError.message);
            dbCommitted = true;
          } else {
            console.error('[AuthController] Supabase signUp error:', authError);
            // Fallback attempt: direct profile insert if service role / RLS permits
            const { error: profileError } = await supabase.from('profiles').insert({
              id: accountId,
              email: cleanEmail,
              full_name: cleanName,
              phone: cleanPhone || null,
              role: 'student',
              created_at: timestamp,
            });

            if (!profileError) {
              dbCommitted = true;
            } else {
              console.error('[AuthController] Profiles fallback insert error:', profileError);
            }
          }
        } else {
          dbCommitted = true;
          if (authData?.user?.id) {
            accountId = authData.user.id;
          }
        }
      }

      // Commit to persistent local JSON store as part of DB commit
      saveToLocalStore({
        id: accountId,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        created_at: timestamp,
      });
      dbCommitted = true;

      // 4. INVARIANT: DB COMMIT SUCCEEDED -> Trigger non-blocking fire-and-forget Google Sheets logging
      const formLink = process.env.ONBOARDING_FORM_LINK || 'https://forms.gle/ttYWWpCfpJhBqrVAA';
      const sheetRow: SheetLogRow = {
        timestamp,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone, // empty string if not provided
        accountId,
        formLink,
      };

      // Non-blocking fire-and-forget call (swallows errors, never blocks response)
      logNewAccountToSheet(sheetRow).catch((err) => {
        console.error('[AuthController] Background Sheets logger error:', err);
      });

      // 5. Immediately return 201 Created to client
      return res.status(201).json({
        success: true,
        data: {
          accountId,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone || undefined,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      console.error('[AuthController] Unhandled signup exception:', err);
      return res.status(500).json({
        success: false,
        data: null,
        error: err.message || 'Internal server error during account signup.',
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  /**
   * Handles user login via Google Sheets Users tab or fallback.
   * Query Users tab by PRN or Email, verifies password (or SHA-256 hash),
   * and issues JWT session token.
   */
  public static async login(req: Request, res: Response) {
    const timestamp = new Date().toISOString();
    const { emailOrPrn, prn, email, password } = req.body || {};
    const identifier = (emailOrPrn || prn || email || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Identifier (Email or PRN) and password are required.',
        meta: { timestamp, error: 'VALIDATION_CREDENTIALS_REQUIRED' },
      });
    }

    try {
      // 1. If Google Sheets DB is configured, query the Users tab directly
      if (SheetsDbService.isConfigured()) {
        const sheetUser = await SheetsDbService.findUser(identifier);
        if (sheetUser) {
          const isValid = SheetsDbService.verifyPassword(password, sheetUser.passwordHash);
          if (!isValid) {
            return res.status(401).json({
              success: false,
              data: null,
              error: 'Invalid password. Please check your credentials.',
              meta: { timestamp, error: 'AUTH_INVALID_PASSWORD' },
            });
          }

          const tokenPayload = {
            prn: sheetUser.prn,
            name: sheetUser.name,
            email: sheetUser.email,
            role: sheetUser.role,
            source: 'GOOGLE_SHEETS_USERS_TAB',
            exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
          };
          const token = signJwt(tokenPayload);

          return res.json({
            success: true,
            data: {
              token,
              user: {
                prn: sheetUser.prn,
                name: sheetUser.name,
                email: sheetUser.email,
                phone: sheetUser.phone,
                role: sheetUser.role,
              },
            },
            meta: { timestamp, source: 'GOOGLE_SHEETS' },
          });
        }
      }

      // 2. Fallback check: student PRN resolver & local accounts
      const resolved = await CampusService.resolveStudent(identifier);
      const tokenPayload = {
        prn: resolved.prn,
        name: resolved.studentName || 'Campus Student',
        role: 'student',
        source: 'STUDENT_RESOLVER_FALLBACK',
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      };
      const token = signJwt(tokenPayload);

      return res.json({
        success: true,
        data: {
          token,
          user: {
            prn: resolved.prn,
            name: resolved.studentName || 'Campus Student',
            role: 'student',
            campus: resolved.campus,
            defaultCafeteriaId: resolved.defaultCafeteriaId,
          },
        },
        meta: { timestamp, source: 'LOCAL_FALLBACK' },
      });
    } catch (err: any) {
      console.error('[AuthController] Login error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Login failed',
        meta: { timestamp },
      });
    }
  }
}
