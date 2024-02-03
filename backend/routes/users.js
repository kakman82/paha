import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import { updateProfile } from '../controllers/user.js';

const router = express.Router();

// Update user profile
router.put('/update-profile/:id', verifyToken, updateProfile);

export default router;
