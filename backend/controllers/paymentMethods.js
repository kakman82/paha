import PaymentMethod from '../models/PaymentMethod.js';
import { createError } from '../utils/error.js';

//! @route:  POST api/paymentMethods
//! @dec:    Create a new method
//! @access: Private
export const createPaymentMethod = async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(createError(400, 'Payment method name is required!'));

  const duplicateMethod = await PaymentMethod.findOne({
    user: req.user._id,
    name,
  }).exec();

  if (duplicateMethod !== null && Object.entries(duplicateMethod).length > 0)
    return next(
      createError(
        409,
        'The given method name is already exist. Please enter a different one!'
      )
    );

  try {
    const newPaymentMethod = await PaymentMethod.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({
      message: 'New payment method has been created!',
      newPaymentMethod,
    });
  } catch (error) {
    next(error);
  }
};
//! @route:  GET api/paymentMethods
//! @dec:    Get all paymentMethods
//! @access: Private
export const getAllPaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await PaymentMethod.find({ user: req.user._id });

    if (!paymentMethods)
      return next(
        createError(404, 'No payment method found, create a new one!')
      );

    res.status(200).json({
      paymentMethods,
    });
  } catch (err) {
    next(err);
  }
};

//! @route:  GET api/paymentMethods
//! @dec:    Get paymentMethods by page
//! @access: Private
export const getPaymentMethodsByPage = async (req, res, next) => {
  const { page, limit } = req.query;

  const pageStartingIndex =
    (Number(parseInt(page) > 0 ? parseInt(page) : 1) - 1) * parseInt(limit);

  try {
    const paymentMethods = await PaymentMethod.find({ user: req.user._id })
      .sort('-createdAt')
      .populate({ path: 'user', select: 'firstName' })
      .limit(limit)
      .skip(pageStartingIndex)
      .exec();

    if (!paymentMethods)
      return next(
        createError(404, 'No payment method found, create a new one!')
      );

    const lengthOfPaymentMethods = await PaymentMethod.find({
      user: req.user._id,
    }).countDocuments();

    res.status(200).json({
      totalLength: lengthOfPaymentMethods,
      result: paymentMethods.length,
      paymentMethods,
    });
  } catch (error) {
    next(error);
  }
};
//! @route:  PUT api/paymentMethods/id
//! @dec:    Update PaymentMethod
//! @access: Private
export const updatePaymentMethod = async (req, res, next) => {
  const { methodName } = req.body;

  try {
    const foundPaymentMethod = await PaymentMethod.findById(req.params.id);
    if (!foundPaymentMethod)
      return next(createError(404, 'Payment method not found'));

    const checkNameExist = await PaymentMethod.find({
      user: req.user._id,
    }).exec();

    if (checkNameExist.filter((el) => el.name === methodName).length > 0) {
      return next(
        createError(409, 'The entered method name is already exist!')
      );
    }

    if (req.user._id.toString() === foundPaymentMethod.user.toString()) {
      const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: methodName,
          },
        },
        { new: true }
      );
      res.status(201).json({
        updatedPaymentMethod,
        message: 'Payment method has been updated!',
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

//! @route:  DELETE api/paymentMethods/id
//! @dec:    Delete PaymentMethod
//! @access: Private
export const deletePaymentMethod = async (req, res, next) => {
  const { id } = req.params;
  try {
    const foundPaymentMethod = await PaymentMethod.findById(id);
    if (!foundPaymentMethod)
      return next(createError(404, 'Payment method not found!'));

    if (req.user._id.toString() === foundPaymentMethod.user.toString()) {
      await PaymentMethod.findByIdAndDelete(id);
      res.status(200).json({ message: 'Payment method has been deleted!' });
    } else {
      return next(
        createError(404, 'You are not authorized to make this action!')
      );
    }
  } catch (error) {
    next(error);
  }
};
