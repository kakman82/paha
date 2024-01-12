import { apiSlice } from './apiSlice';

const USERS_URL = 'auth';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sign-in`,
        credentials: 'include',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/sign-out`,
        method: 'POST',
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}/sign-up`,
        credentials: 'include',
        method: 'POST',
        body: userData,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-email`,
        credentials: 'include',
        method: 'POST',
        body: data,
      }),
    }),
    resendEmailVerificationToken: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/resend-email-verification-token`,
        credentials: 'include',
        method: 'POST',
        body: userId,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: `${USERS_URL}/forgot-password`,
        method: 'POST',
        body: email,
      }),
    }),
    verifyResetPasswordToken: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-password-reset-token`,
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/reset-password`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendEmailVerificationTokenMutation,
  useForgotPasswordMutation,
  useVerifyResetPasswordTokenMutation,
  useResetPasswordMutation,
} = usersApiSlice;
