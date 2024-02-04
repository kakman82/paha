import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 8080;
import { connectDB } from './config/dbConn.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import paymentMethodRoutes from './routes/paymentMethods.js';
import expenseRoutes from './routes/expenses.js';

const app = express();

// DB Connect;
connectDB();

// Middlewares;
// 👇️ specify origins to allow
const whitelist = [
  'http://localhost:3000',
  'https://paha-kakman82.vercel.app',
  'https://paha-five.vercel.app',
];

// ✅ Enable pre-flight requests
app.options('*', cors());

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes;
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/expenses', expenseRoutes);

// Error handler;
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong!';

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === 'dev' ? err.stack : null,
  });
});

// Not found url
// app.use((req, res, next) => {
//   let error = new Error(`Not Found - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// });

app.get('/', (req, res) => {
  res.json('Hello from Xpenss MERN App Api...');
});

mongoose.connection.once('open', () => {
  console.log('DB connection is succesfull...');

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
