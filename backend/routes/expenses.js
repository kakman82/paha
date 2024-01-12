import express from 'express';
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getLatestExpense,
  getSingleExpense,
  updateExpense,
} from '../controllers/expenses.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

// Create an expense
router.post('/', verifyToken, createExpense);

// Get all expenses
router.get('/', verifyToken, getAllExpenses);

// Get latest expense records
router.get('/latest', verifyToken, getLatestExpense);

// Get single expense
router.get('/:id', verifyToken, getSingleExpense);

// Get total of expenses by categories
router.get('/total-by-categories', verifyToken);

// Update an expense
router.put('/:id', verifyToken, updateExpense);

// Delete an expense
router.delete('/:id', verifyToken, deleteExpense);

export default router;
