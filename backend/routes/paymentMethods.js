import express from 'express';
import {
  createPaymentMethod,
  deletePaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodsByPage,
  updatePaymentMethod,
} from '../controllers/paymentMethods.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

// Create payment method
router.post('/', verifyToken, createPaymentMethod);
// Get all payment methods
router.get('/', verifyToken, getAllPaymentMethods);
// Get payment methods by page
router.get('/', verifyToken, getPaymentMethodsByPage);
// Update payment method
router.put('/:id', verifyToken, updatePaymentMethod);
// Delete payment method
router.delete('/:id', verifyToken, deletePaymentMethod);

export default router;
