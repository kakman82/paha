import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoriesByPage,
  updateCategory,
} from '../controllers/categories.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

// Create category
router.post('/', verifyToken, createCategory);
// Get all categories
router.get('/', verifyToken, getAllCategories);
// Get categories by page
router.get('/', verifyToken, getCategoriesByPage);
// Update category
router.put('/:id', verifyToken, updateCategory);
// Delete Categoty
router.delete('/:id', verifyToken, deleteCategory);

export default router;
