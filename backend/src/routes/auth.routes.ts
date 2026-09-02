import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

export const authRouter = Router();

// POST /api/auth/signup - Create new student/user account with mandatory email & async Google Sheets logging
authRouter.post('/signup', AuthController.signup);

// POST /api/auth/login - Query Users tab in Google Sheets or resolver fallback, return JWT session token
authRouter.post('/login', AuthController.login);

