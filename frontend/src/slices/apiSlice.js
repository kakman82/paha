import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://paha-api.vercel.app/api' || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // credentials: 'include',
  credentials: false,
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Expenses', 'Categories', 'PaymentMethods'],
  endpoints: (builder) => ({}),
});
