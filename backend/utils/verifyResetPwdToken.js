import { createError } from './error.js';
import ResetToken from '../models/ResetToken.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import brcypt from 'bcrypt';

// @route:  POST  api/auth/verify-password-reset-token
// @dec:    verifying user reset password token
// @access: Public
export const isResetPwdTokenVerified = async (req, res, next) => {
  try {
    const { token, id } = req.body;

    if (!token || !mongoose.isValidObjectId(id))
      return next(
        createError(401, 'Invalid request, missing token or user ID!')
      );

    const foundResetToken = await ResetToken.findOne({ user: id }).exec();
    if (!foundResetToken)
      return next(
        createError(
          404,
          'Unauthorized access, reset token not found! \n Please request a new reset token link!'
        )
      );

    const foundUser = await User.findById(id);
    if (!foundUser)
      return next(createError(404, 'Unauthorized access, user not found!'));

    const matchResetToken = await brcypt.compare(token, foundResetToken.token);

    if (!matchResetToken)
      return next(createError(404, 'Please provide a valid token!'));

    // If everything is ok
    req.resetToken = foundResetToken.token;
    next();
  } catch (err) {
    next(err);
  }
};
