import { apiSlice } from './apiSlice';

export const expenseApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ['Expenses'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getExpenses: builder.query({
        query: (q) => ({
          url: `/expenses/by-dates?page=${q.page}&limit=${q.limit}&search=${q.searchKeyword}&startDate=${q.startDate}&endDate=${q.endDate}`,
        }),
        providesTags: ['Expenses'],
      }),
      getLatestExpenses: builder.query({
        query: () => ({
          url: '/expenses/latest',
        }),
        providesTags: ['Expenses'],
      }),
      getAllExpenses: builder.query({
        query: () => ({
          url: '/expenses',
        }),
        providesTags: ['Expenses'],
      }),
      getExpensesByYear: builder.query({
        query: (year) => ({
          url: `/expenses/total-by-categories/${year}`,
        }),
        providesTags: ['Expenses'],
      }),
      getOneExpense: builder.query({
        query: (id) => ({
          url: `/expenses/${id}`,
        }),
        providesTags: ['Expenses'],
      }),
      createExpense: builder.mutation({
        query: (data) => ({
          url: '/expenses',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Expenses'],
      }),
      updateExpense: builder.mutation({
        query: (data) => ({
          url: `/expenses/${data.expenseId}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['Expenses'],
      }),
      deleteExpense: builder.mutation({
        query: (id) => ({
          url: `/expenses/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Expenses'],
      }),
    }),
  });

export const {
  useGetExpensesQuery,
  useGetLatestExpensesQuery,
  useGetAllExpensesQuery,
  useGetExpensesByYearQuery,
  useGetOneExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApiSlice;
