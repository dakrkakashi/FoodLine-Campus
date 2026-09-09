import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { loginRateLimiter } from '../middleware/rate-limiter.js';

export const authRouter = Router();

// POST /api/auth/signup - Create new student/user account with rate limit (max 5 per 15 min)
authRouter.post('/signup', loginRateLimiter, AuthController.signup);

// POST /api/auth/login - Query Users tab in Google Sheets with rate limit (max 5 per 15 min)
authRouter.post('/login', loginRateLimiter, AuthController.login);
