import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://paha-api.vercel.app/api' || 'http://localhost:8080/api',
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Expenses', 'Categories', 'PaymentMethods'],
  endpoints: (builder) => ({}),
});
