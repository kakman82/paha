import { apiSlice } from './apiSlice';

export const categoryApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ['Categories'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllCategories: builder.query({
        query: () => ({
          url: '/categories',
        }),
      }),
      getCategories: builder.query({
        query: (q) => ({
          url: `/categories?page=${q.page}&limit=${q.limit}`,
        }),
        providesTags: ['Categories', 'Expenses'],
      }),
      createCategory: builder.mutation({
        query: (data) => ({
          url: '/categories',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Categories', 'Expenses'],
      }),
      updateCategory: builder.mutation({
        query: (category) => ({
          url: `/categories/${category.id}`,
          method: 'PUT',
          body: category,
        }),
        invalidatesTags: ['Categories', 'Expenses'],
      }),
      deleteCategory: builder.mutation({
        query: (id) => ({
          url: `/categories/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Categories', 'Expenses'],
      }),
    }),
  });

export const {
  useGetAllCategoriesQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;
