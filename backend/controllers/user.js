import User from '../models/User.js';
import { createError } from '../utils/error.js';
import generateToken from '../utils/generateToken.js';

// @route:  PUT api/update-profile/id
// @dec:    Update profile
// @access: Private
export const updateProfile = async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  const userId = req.params.id;

  try {
    const foundUser = await User.findById(userId);
    if (!userId) return next(createError(404, 'User not found!'));

    if (req.user._id.toString() === foundUser._id.toString()) {
      const updatedProfile = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            email: email,
          },
        },
        { new: true }
      );

      const { password, ...others } = updatedProfile._doc;

      res.status(201).json({
        updatedProfile: others,
        token: generateToken(res, updatedProfile._id),
        message: 'User profile has been updated!',
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
