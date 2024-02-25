import jwt from 'jsonwebtoken';
import { createError } from './error.js';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token)
    return next(
      createError(401, 'You are not authenticated! No token provided!')
    );

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // for set request user after decoded requested cookie that comes with header
    req.user = await User.findById(decoded.userId.toString()).select(
      '-password'
    );

    next();
  } catch (err) {
    next(createError(403, 'Token is not valid! Please log-in again...'));
  }
};
