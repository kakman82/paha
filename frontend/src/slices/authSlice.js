import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
      localStorage.setItem(
        'access_token',
        JSON.stringify(action.payload.token)
      );
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('access_token');
      // for refreshing the page after logout to clear RTK query cache..
      location.reload();
    },
    setEmailVerify: (state) => {
      state.userInfo.isVerified = true;
    },
  },
});

export const { setCredentials, clearCredentials, setEmailVerify } =
  authSlice.actions;

export default authSlice.reducer;
