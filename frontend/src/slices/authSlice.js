import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
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
