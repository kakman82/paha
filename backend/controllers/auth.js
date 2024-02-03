import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createError } from '../utils/error.js';
import { generateOTP, mailTransport, sendEmail } from '../utils/mail.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import VerificationToken from '../models/VerificationToken.js';
import ResetToken from '../models/ResetToken.js';
import { verifyEmailTemplate } from '../views/verifyEmailTemplate.js';
import { welcomeEmailTemplate } from '../views/welcomeEmailTemplate.js';
import { passwordResetTemplate } from '../views/passwordResetTemplate.js';
import { passwordChangedTemplate } from '../views/passwordChangedTemplate.js';
import dotenv from 'dotenv';
dotenv.config();

// @route:  POST api/auth/sign-up
// @desc:    Register & Create a new user
// @access: Public
export const signup = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Check all req data empty or not
  if (!firstName || !lastName || !email || !password)
    return next(
      createError(
        400,
        'All fields are required! Please provide all informations.'
      )
    );

  // Check user already exist or not?
  const checkDuplicate = await User.findOne({
    email: email.toLowerCase(),
  }).exec();

  if (checkDuplicate)
    return next(createError(409, `${email.toLowerCase()} is already exist!`));

  // Check password length
  if (password.trim().length < 6 || password.trim().length > 20)
    return next(createError(400, 'Password must be 6 to 20 characters long!'));

  // Password encyrp
  const hashedPwd = await bcrypt.hash(password.trim(), 10);

  try {
    // Create and save user into DB
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPwd,
    });

    // Create OTP (one time password) for email verification and save this in DB
    const OTP = generateOTP();
    const hashedOTP = await bcrypt.hash(OTP, 10);

    const newVerificationToken = await VerificationToken.create({
      user: newUser._id,
      token: hashedOTP,
    });

    // Send verification code (OTP) to the user by email
    if (process.env.NODE_ENV === 'dev') {
      // By Mailtrap for testing
      mailTransport().sendMail({
        from: process.env.TEAM_EMAIL_ADDRESS,
        to: newUser.email,
        subject: `Verification code: ${OTP} - Valid for only 1 hour!`,
        html: verifyEmailTemplate(OTP, newUser.firstName),
      });
    } else if (process.env.NODE_ENV === 'prod') {
      // By sendgrid in production
      sendEmail({
        to: newUser.email,
        subject: `Verification code: ${OTP} - Valid for only 1 hour!`,
        templateId: 'd-b8723a62c1734111a64da816de28a4c3',
        OTP: OTP,
        firstName: newUser.firstName,
      });
    }

    // Create JWT token and Parse token as a cookie on the response;
    generateToken(res, newUser._id);

    const { password, ...others } = newUser._doc;

    res.status(201).json({
      user: others,
      msg: `Hello ${newUser.firstName}, please verify your email! A verification code has been sent to your email...`,
    });
  } catch (error) {
    next(error);
  }
};

// @route:  POST api/auth/sign-in
// @desc:    Login & Sign-in  user
// @access: Public
export const signin = async (req, res, next) => {
  // Check req body
  const { email, password } = req.body;
  if (!email || !password)
    return next(createError(400, 'Email and password are required!'));

  try {
    // Check user is already in the DB?
    const foundUser = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();

    // This is secure way for not to show someone which credentials are wrong
    if (!foundUser || !(await bcrypt.compare(password, foundUser?.password))) {
      return next(
        createError(401, 'Wrong credentials. Incorrect email or password!')
      );
    }

    // Create JWT token and arse token as a cookie on the response;
    generateToken(res, foundUser._id);

    const user = await User.findById(foundUser?._id);

    res.status(200).json({
      user: user,
      message: `Welcome ${foundUser.firstName}!`,
    });
  } catch (error) {
    next(error);
  }
};

// @route:  POST api/auth/sign-out
// @desc:    Logout & Sign-out  user
// @access: Private
export const signout = (req, res, next) => {
  res.clearCookie('access_token', {
    httpOnly: process.env.NODE_ENV === 'prod' ? true : false,
    secure: true,
    sameSite: 'strict', // Prevent CSRF attacks
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logout is done successfully. ' });
};

// @route:  POST api/auth/verify-email
// @desc:    Verification user email
// @access: Private
export const verifyEmail = async (req, res, next) => {
  const { userId, otp } = req?.body;

  if (!userId || !otp)
    return next(
      createError(401, 'Invalid request, missing verification code or user ID!')
    );

  if (!mongoose.isValidObjectId(userId))
    return next(createError(401, 'Invalid user id!'));

  const foundUser = await User.findById(userId);
  if (!foundUser) return next(createError(404, 'User not found!'));

  if (userId.toString() !== foundUser._id.toString())
    return next(createError(404, 'You are not authorized!'));

  if (foundUser.isVerified)
    return next(createError(400, 'This email account is already verified!'));

  try {
    const emailToken = await VerificationToken.findOne({
      user: userId,
    }).exec();

    if (!emailToken) return next(createError(404, 'Token is not found!'));

    const checkEmailToken = await bcrypt.compare(otp, emailToken.token);

    if (!checkEmailToken)
      return next(
        createError(
          404,
          'The given code is incorrect... Please provide a valid code!'
        )
      );

    // After validation do the DB stuff - isVerified = true and expireable token will be deleted
    foundUser.isVerified = true;
    await VerificationToken.findByIdAndDelete(emailToken._id);
    foundUser.save();

    // Send welcome email to the user after email verification is succeed
    if (process.env.NODE_ENV === 'dev') {
      // By mailtrap for testing ;
      mailTransport().sendMail({
        from: process.env.TEAM_EMAIL_ADDRESS,
        to: foundUser.email,
        subject: 'Email Verification is succeed',
        html: welcomeEmailTemplate(foundUser.firstName),
      });
    } else if (process.env.NODE_ENV === 'prod') {
      // By sendgrid in production
      sendEmail({
        to: foundUser.email,
        subject: 'Email Verification is succeed',
        templateId: 'd-d6241ec2c61646a9b59ce170aee809a6',
        firstName: foundUser.firstName,
      });
    }

    res.status(200).json({
      message: 'Your email account has been verified successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @route:  POST api/auth/resend-email-verification-token
// @desc:    Resend Verification token to the user email
// @access: Private
export const resendEmailVerificationToken = async (req, res, next) => {
  const { userId } = req.body;

  if (!mongoose.isValidObjectId(userId))
    return next(createError(401, 'Invalid user id!'));

  const foundUser = await User.findById(userId);
  if (!foundUser) return next(createError(404, 'User not found!'));

  if (foundUser.isVerified)
    return next(createError(400, 'This email account is already verified!'));

  try {
    const alreadyHasToken = await VerificationToken.findOne({
      user: foundUser._id,
    }).exec();

    if (alreadyHasToken)
      return next(
        createError(
          400,
          'You have a valid code. Please check your email! After one hour you can request another token!'
        )
      );
    // if not token in db create a new one and save it into the db;
    const newOTP = generateOTP();
    const hashedNewOTP = await bcrypt.hash(newOTP, 10);

    const newToken = await VerificationToken.create({
      user: foundUser._id,
      token: hashedNewOTP,
    });

    if (process.env.NODE_ENV === 'dev') {
      // Send verification email to user with new OPT;
      mailTransport().sendMail({
        from: process.env.TEAM_EMAIL_ADDRESS,
        to: foundUser.email,
        subject: `Verification code: ${newOTP} - Valid for only 1 hour!`,
        html: verifyEmailTemplate(newOTP, foundUser.firstName),
      });
    } else if (process.env.NODE_ENV === 'prod') {
      // Send email with sendgrid in production
      sendEmail({
        to: foundUser.email,
        subject: `Verification code: ${newOTP} - Valid for only 1 hour!`,
        templateId: 'd-b8723a62c1734111a64da816de28a4c3',
        OTP: newOTP,
        firstName: foundUser.firstName,
      });
    }
    return res.status(200).json({
      message:
        'A new verification code has been sent to your registered email account. This code will be valid for only 1 hour!',
    });
  } catch (err) {
    next(err);
  }
};

// @route:  POST  api/auth/forgot-password
// @desc:    Forgot password - send user a link
// @access: Public
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(createError(400, 'Please provide a valid email!'));

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return next(createError(404, 'User email not found!'));

  // Check reset token is already in DB or it is expired
  const foundToken = await ResetToken.findOne({ user: foundUser._id }).exec();
  // If there is token in DB;
  if (foundToken)
    return next(
      createError(
        401,
        'Only after 1 hour you can request for another reset token!'
      )
    );

  try {
    // If not token, generate new one and save it into DB;
    const newToken = crypto.randomBytes(16).toString('hex');
    const hashedNewToken = await bcrypt.hash(newToken, 10);

    await ResetToken.create({
      user: foundUser._id,
      token: hashedNewToken,
    });

    // Generate reset URL with token and user ID;
    const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${newToken}&id=${foundUser._id}`;

    if (process.env.NODE_ENV === 'dev') {
      // Send password reset link to user email
      mailTransport().sendMail({
        from: process.env.TEAM_EMAIL_ADDRESS,
        to: foundUser.email,
        subject: 'Password Reset',
        html: passwordResetTemplate(foundUser.firstName, resetURL),
      });
    } else if (process.env.NODE_ENV === 'prod') {
      // Send password reset link to user email by SendGrid in production
      sendEmail({
        to: foundUser.email,
        subject: 'Password Reset',
        templateId: 'd-86ef7da189ea4285a2cc2406e7d754fb',
        firstName: foundUser.firstName,
        url: resetURL,
      });
    }

    // send success response
    res.status(200).json({
      message:
        'Password reset link has been sent to the your email account! Please check your email...',
    });
  } catch (err) {
    next(err);
  }
};

// @desc: Return only valid true after checking reset password token is valid or not by verifyResetPwdToken.js
export const resetPasswordTokenStatus = (req, res, next) => {
  res.status(201).json({ verified: true });
};

// @route:  POST  api/auth/reset-password
// @desc:    Reset password - user create a new password
// @access: Public
export const resetPassword = async (req, res, next) => {
  const { password, id } = req.body;

  if (!password)
    return next(createError(400, 'Please provide a new password!'));

  const foundUser = await User.findOne({ _id: id }).select('+password');

  if (!foundUser) return next(createError(404, 'User not found'));
  // Check given new password is the same the current one or not
  const isSamePassword = await bcrypt.compare(password, foundUser.password);

  if (isSamePassword)
    return next(
      createError(
        409,
        'New password must be the different than the previous one!'
      )
    );
  // Check password length
  if (password.trim().length < 6 || password.trim().length > 20)
    return next(createError(400, 'Password must be 6 to 20 characters long!'));

  try {
    // If everything is ok then hashed and save new password
    const hashedNewPwd = await bcrypt.hash(password.trim(), 10);
    foundUser.password = hashedNewPwd;
    await foundUser.save();

    // And delete reset token from DB;
    await ResetToken.findOneAndDelete({ user: foundUser._id });

    // Send to user confirmation email;
    if (process.env.NODE_ENV === 'dev') {
      // By mailtrap for testing
      mailTransport().sendMail({
        from: process.env.TEAM_EMAIL_ADDRESS,
        to: foundUser.email,
        subject: 'Password Reset Successfully',
        html: passwordChangedTemplate(foundUser.firstName),
      });
    } else if (process.env.NODE_ENV === 'prod') {
      // By SendGrid in production
      sendEmail({
        to: foundUser.email,
        subject: 'Password Reset Successfully',
        templateId: 'd-1c5fd28d3762405886b06a59b319f904',
        firstName: foundUser.firstName,
      });
    }
    res.status(201).json({
      success: true,
      message:
        'Your password has been changed. Now you can login with your new password.',
    });
  } catch (err) {
    next(err);
  }
};
