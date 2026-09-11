import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { loginRateLimiter, passwordResetRateLimiter } from '../middleware/rate-limiter.js';

export const authRouter = Router();

// POST /api/auth/signup - Create new student/user account with rate limit (max 5 per 15 min)
authRouter.post('/signup', loginRateLimiter, AuthController.signup);

// POST /api/auth/login - Query Users tab in Google Sheets with rate limit (max 5 per 15 min)
authRouter.post('/login', loginRateLimiter, AuthController.login);

// POST /api/auth/forgot-password - Request password recovery link (max 3 per 15 min)
authRouter.post('/forgot-password', passwordResetRateLimiter, AuthController.forgotPassword);

// GET & POST /api/auth/verify-reset-token - Verify token authenticity before rendering reset form
authRouter.get('/verify-reset-token', AuthController.verifyResetToken);
authRouter.post('/verify-reset-token', AuthController.verifyResetToken);

// POST /api/auth/reset-password - Execute password update with valid token
authRouter.post('/reset-password', passwordResetRateLimiter, AuthController.resetPassword);
