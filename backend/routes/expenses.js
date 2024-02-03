import express from 'express';
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getAllExpensesByDates,
  getLatestExpense,
  getSingleExpense,
  getYearlyExpensesByCategories,
  updateExpense,
} from '../controllers/expenses.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

// Create an expense
router.post('/', verifyToken, createExpense);

// Get all expenses
router.get('/', verifyToken, getAllExpenses);

// Get expenses by given dates
router.get('/by-dates', verifyToken, getAllExpensesByDates);

// Get latest expense records
router.get('/latest', verifyToken, getLatestExpense);

// Get single expense
router.get('/:id', verifyToken, getSingleExpense);

// Get total of yearly expenses by categories
router.get(
  '/total-by-categories/:year',
  verifyToken,
  getYearlyExpensesByCategories
);

// Update an expense
router.put('/:id', verifyToken, updateExpense);

// Delete an expense
router.delete('/:id', verifyToken, deleteExpense);

export default router;
