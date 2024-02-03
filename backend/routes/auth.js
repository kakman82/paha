import express from 'express';
import {
  signup,
  signin,
  signout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendEmailVerificationToken,
  resetPasswordTokenStatus,
} from '../controllers/auth.js';
import { isResetPwdTokenVerified } from '../utils/verifyResetPwdToken.js';

const route = express.Router();

// Sign-up & Register
route.post('/sign-up', signup);
// Email verification
route.post('/verify-email', verifyEmail);
// Resend Email Verification Token
route.post('/resend-email-verification-token', resendEmailVerificationToken);
// Sign-in & Login
route.post('/sign-in', signin);
// Sign-out & Logout
route.post('/sign-out', signout);
// Forgot Password
route.post('/forgot-password', forgotPassword);
// Verify Reset Password Token
route.post(
  '/verify-password-reset-token',
  isResetPwdTokenVerified,
  resetPasswordTokenStatus
);
// Reset Password
route.post('/reset-password', isResetPwdTokenVerified, resetPassword);

export default route;
