import jwt from 'jsonwebtoken';

function generateToken(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '90d',
  });

  res.cookie('access_token', token, {
    // httpOnly: process.env.NODE_ENV === 'prod' ? true : false,
    httpOnly: true,
    secure: false,
    // secure: process.env.NODE_ENV === 'prod' ? true : false,
    // Prevent CSRF attacks sameSite: 'strict' - but does not work on safari
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export default generateToken;
