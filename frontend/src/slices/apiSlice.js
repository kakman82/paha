import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl:
    'https://paha-api-kakman82.vercel.app/api' ||
    'https://paha-api.vercel.app/api' ||
    'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : 'https://paha-api-kakman82.vercel.app/api' ||
    'https://paha-api.vercel.app/api' ||
  },
  credentials: 'include',
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Expenses', 'Categories', 'PaymentMethods'],
  endpoints: (builder) => ({}),
});
