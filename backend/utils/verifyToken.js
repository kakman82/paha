import jwt from 'jsonwebtoken';
import { createError } from './error.js';
import User from '../models/User.js';

// for the verify bearer token from the header
export const verifyToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from the header
      token = req.headers.authorization.split(' ')[1];

      if (!token)
        return next(
          createError(401, 'You are not authenticated! No token provided!')
        );

      // Verify token
      const decoded = jwt.verify(JSON.parse(token), process.env.JWT_SECRET);

      // Get user (except password) from the token
      req.user = await User.findById(decoded?.userId.toString()).select(
        '-password'
      );
      next();
    } catch (error) {
      next(createError(403, 'Token is not valid! Please log-in again...'));
    }
  }
};

// for the verify cookie;
// export const verifyToken = async (req, res, next) => {
//   const token = req.cookies?.access_token;

//   if (!token)
//     return next(
//       createError(401, 'You are not authenticated! No token provided!')
//     );

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // for set request user after decoded requested cookie that comes with header
//     req.user = await User.findById(decoded.userId.toString()).select(
//       '-password'
//     );

//     next();
//   } catch (err) {
//     next(createError(403, 'Token is not valid! Please log-in again...'));
//   }
// };
