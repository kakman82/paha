import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Expenses', 'Categories', 'PaymentMethods'],
  endpoints: (builder) => ({}),
});