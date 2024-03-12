import { apiSlice } from './apiSlice';

// ana apiSlice altında birden fazla tagtypes tanımlama yapısı enhanceEndpoints
// https://stackoverflow.com/questions/74965049/how-do-you-create-tagtypes-for-multiple-endpoints-in-rtk-query

export const paymentMethodApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ['PaymentMethods'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllPaymentMethods: builder.query({
        query: () => ({
          url: '/payment-methods',
        }),
      }),
      getPaymentMethods: builder.query({
        query: (q) => ({
          url: `/payment-methods?page=${q.page}&limit=${q.limit}`,
        }),
        providesTags: ['PaymentMethods', 'Expenses'],
      }),
      addPaymentMethod: builder.mutation({
        query: (data) => ({
          url: '/payment-methods',

          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['PaymentMethods', 'Expenses'],
      }),
      updatePaymentMethod: builder.mutation({
        query: (paymentMethod) => ({
          url: `/payment-methods/${paymentMethod.id}`,

          method: 'PUT',
          body: paymentMethod,
        }),
        invalidatesTags: ['PaymentMethods', 'Expenses'],
      }),
      deletePaymentMethod: builder.mutation({
        query: (id) => ({
          url: `/payment-methods/${id}`,

          method: 'DELETE',
        }),
        invalidatesTags: ['PaymentMethods', 'Expenses'],
      }),
    }),
  });

export const {
  useGetAllPaymentMethodsQuery,
  useGetPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentMethodApiSlice;
