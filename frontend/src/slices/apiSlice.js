import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  // baseUrl: 'http://localhost:8080/api',
  baseUrl: 'https://paha-api.vercel.app/api' || 'http://localhost:8080/api',

  //credentials: 'include', // when using req.cookie
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Expenses', 'Categories', 'PaymentMethods'],
  endpoints: (builder) => ({}),
});
