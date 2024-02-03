import Expense from '../models/Expense.js';
import { createError } from '../utils/error.js';

//! @route:  POST api/expenses
//! @dec:    Create a new expense transaction
//! @access: Private
export const createExpense = async (req, res, next) => {
  try {
    const newExpense = await Expense.create({
      ...req.body,
      user: req.user._id,
      category: req.body.categoryId,
      paymentMethod: req.body.paymentMethodId,
    });
    res
      .status(200)
      .json({ newExpense, message: 'New expense has been created!' });
  } catch (error) {
    next(error);
  }
};

//! @route:  GET api/expenses/by-dates
//! @dec:    Get expenses by given dates
//! @access: Private
export const getAllExpensesByDates = async (req, res, next) => {
  const { page, limit, search, startDate, endDate } = req.query;

  const pageStartingIndex =
    (Number(parseInt(page) > 0 ? parseInt(page) : 1) - 1) * parseInt(limit);

  try {
    const filteredExpenses = await Expense.find({
      user: req.user._id,
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } },
      ],
      date: {
        $gte: startDate
          ? new Date(startDate).toISOString()
          : new Date('1970-01-01Z00:00:00:000').toISOString(),
        $lt: endDate
          ? new Date(endDate).toISOString()
          : new Date().toISOString(),
      },
    })
      .populate({
        path: 'category',
        select: 'name color',
      })
      .populate({ path: 'paymentMethod', select: 'name' })
      .sort('-date')
      .limit(limit)
      .skip(pageStartingIndex)
      .exec();

    const lengthOfExpenses = await Expense.find({
      user: req.user._id,
    }).countDocuments();

    if (!filteredExpenses)
      return next(createError(404, 'No expenses found, create a new one!'));

    res.status(200).json({
      totalLength: lengthOfExpenses,
      result: filteredExpenses.length,
      expenses: filteredExpenses,
    });
  } catch (error) {
    next(error);
  }
};

//! @route:  GET api/expenses/latest
//! @dec:    Get latest expense of transactions
//! @access: Private
export const getLatestExpense = async (req, res, next) => {
  try {
    const latest = await Expense.find({ user: req.user._id })
      .populate({
        path: 'category',
        select: 'name color',
      })
      .populate({ path: 'paymentMethod', select: 'name' })
      .sort('-date')
      .limit(3);

    if (!latest)
      return next(createError(404, 'No expenses found, create a new one!'));

    res.status(200).json({
      latest,
    });
  } catch (err) {
    next(err);
  }
};

//! @route:  GET api/expenses
//! @dec:    Get all expenses
//! @access: Private
export const getAllExpenses = async (req, res, next) => {
  const { year } = req.body;
  try {
    const allExpenses = await Expense.find({ user: req.user._id })
      .populate({
        path: 'category',
        select: 'name color',
      })
      .populate({ path: 'paymentMethod', select: 'name' })
      .sort('-date');

    if (!allExpenses)
      return next(createError(404, 'No expenses found, create a new one!'));

    const years = [
      ...new Set(allExpenses.map((el) => new Date(el.date).getFullYear())),
    ];

    res.status(200).json({
      result: allExpenses.length,
      years,
      allExpenses,
    });
  } catch (err) {
    next(err);
  }
};

//! @route:  GET api/expenses/:id
//! @dec:    Get single expense
//! @access: Private
export const getSingleExpense = async (req, res, next) => {
  try {
    const expense = await Expense.find({
      user: req.user._id,
      _id: req.params.id,
    })
      .populate({
        path: 'category',
        select: 'name color',
      })
      .populate({ path: 'paymentMethod', select: 'name' });

    if (!expense) return next(createError(404, 'Expense not found!'));

    res.status(200).json({ expense });
  } catch (err) {
    next(err);
  }
};

//! @route:  GET api/expenses/total-by-categories/:year
//! @dec:    Get yearly expense amounts by categories
//! @access: Private
export const getYearlyExpensesByCategories = async (req, res, next) => {
  const { year } = req.params;

  try {
    // https://stackoverflow.com/questions/54335315/mongodb-find-filter-by-month-and-year
    const expensesByGivenYear = await Expense.find({
      user: req.user._id,
      $expr: {
        $and: [
          { $eq: [{ $year: '$date' }, year] },
          // { $eq: [{ $month: '$date' }, 12] },
        ],
      },
    })
      .populate({
        path: 'category',
        select: 'name color',
      })
      .populate({ path: 'paymentMethod', select: 'name' });

    if (!expensesByGivenYear)
      return next(createError(404, 'No expenses found, create a new one!'));

    res.status(200).json({ expensesByGivenYear });
  } catch (err) {
    next(err);
  }
};
export const getMonthlyExpensesByCategories = () => {};

//! @route:  PUT api/expenses/:id
//! @dec:    Update a expense transaction
//! @access: Private
export const updateExpense = async (req, res, next) => {
  try {
    const foundExpense = await Expense.findById(req.params.id);
    if (!foundExpense) return next(createError(404, 'Expense not found!'));

    if (req.user._id.toString() === foundExpense.user.toString()) {
      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id.toString(),
        {
          $set: {
            user: req.user._id,
            category: req.body.categoryId,
            paymentMethod: req.body.paymentMethodId,
            amount: req.body.amount,
            title: req.body.title,
            desc: req.body.desc,
            date: req.body.date,
          },
        },
        { new: true }
      );
      res.status(201).json({
        updatedExpense,
        message: 'Expense has been updated!',
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
//! @route:  DELETE api/expenses/:id
//! @dec:    Delete a expense transaction
//! @access: Private
export const deleteExpense = async (req, res, next) => {
  try {
    const foundExpense = await Expense.findById(req.params.id);
    if (!foundExpense) return next(createError(404, 'Expense not found!'));

    if (req.user._id.toString() === foundExpense.user.toString()) {
      await Expense.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Expense has been deleted!' });
    } else {
      return next(
        createError(404, 'You are not authorized to make this action!')
      );
    }
  } catch (error) {
    next(error);
  }
};
