import Category from '../models/Category.js';
import { createError } from '../utils/error.js';

// @route:  POST api/categories
// @dec:    Create a new category
// @access: Private
export const createCategory = async (req, res, next) => {
  const { name, color } = req.body;

  if (!name || !color)
    return next(createError(400, 'Category name and color are required!'));

  const checkDuplicate = await Category.find({
    user: req.user._id,
  }).exec();

  if (
    checkDuplicate !== null &&
    checkDuplicate.filter((val) => val.color === color).length > 0
  )
    return next(createError(409, 'The selected color is already exist!'));
  if (
    checkDuplicate !== null &&
    checkDuplicate.filter(
      (val) => val.name.toLowerCase() === name.toLowerCase()
    ).length > 0
  )
    return next(
      createError(409, 'The entered category name is already exist!')
    );

  try {
    const newCategory = await Category.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({
      message: 'A new category has been created!',
      category: newCategory,
    });
  } catch (error) {
    next(error);
  }
};
// @route:  GET api/categories
// @dec:    Get all categories
// @access: Private
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id })
      .sort('name')
      .exec();

    if (!categories)
      return next(createError(404, 'No category found, create a new one!'));

    res.status(200).json({
      categories,
    });
  } catch (err) {
    next(err);
  }
};

// @route:  GET api/categories
// @dec:    Get categories by page
// @access: Private
export const getCategoriesByPage = async (req, res, next) => {
  const { page, limit } = req.query;

  const pageStartingIndex =
    (Number(parseInt(page) > 0 ? parseInt(page) : 1) - 1) * parseInt(limit);

  try {
    const categories = await Category.find({ user: req.user._id })
      .sort('-createdAt')
      .populate({ path: 'user', select: 'firstName' })
      .limit(limit)
      .skip(pageStartingIndex)
      .exec();

    if (!categories)
      return next(createError(404, 'No category found, create a new one!'));

    const lengthOfCategories = await Category.find({
      user: req.user._id,
    }).countDocuments();

    res.status(200).json({
      totalLength: lengthOfCategories,
      result: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};
// @route:  PUT api/categories/id
// @dec:    Update category
// @access: Private
export const updateCategory = async (req, res, next) => {
  const { categoryName, categoryColor } = req.body;

  try {
    const foundCategory = await Category.findById(req.params.id);
    if (!foundCategory) return next(createError(404, 'Category not found'));

    const checkForExist = await Category.find({
      user: req.user._id,
    }).exec();

    if (checkForExist.filter((el) => el.color === categoryColor).length > 0) {
      return next(createError(409, 'The selected color is already exist!'));
    }

    if (req.user._id.toString() === foundCategory.user.toString()) {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: categoryName,
            color: categoryColor,
          },
        },
        { new: true }
      );

      res.status(201).json({
        updatedCategory,
        message: 'Category has been updated!',
      });
    } else {
      return next(
        createError(404, 'You are not authorized to make this action!')
      );
    }
  } catch (error) {
    next(error);
  }
};

// @route:  DELETE api/categories/id
// @dec:    Delete category
// @access: Private
export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const foundCategory = await Category.findById(id);
    if (!foundCategory) return next(createError(404, 'Category not found!'));

    if (req.user._id.toString() === foundCategory.user.toString()) {
      await Category.findByIdAndDelete(id);
      res.status(200).json({ message: 'Category has been deleted!' });
    } else {
      return next(
        createError(404, 'You are not authorized to make this action!')
      );
    }
  } catch (error) {
    next(error);
  }
};
