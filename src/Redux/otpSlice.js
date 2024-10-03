// features/otp/otpSlice.js
import { createSlice } from '@reduxjs/toolkit';

const otpSlice = createSlice({
  name: 'otp',
  initialState: {
    email: '',
    otp: '',
  },
  reducers: {
    setOtpEmail: (state, action) => {
      state.email = action.payload;
    },
    setOtpCode: (state, action) => {
      state.otp = action.payload;
    },
    clearOtp: (state) => {
      state.email = '';
      state.otp = '';
    },
  },
});

export const { setOtpEmail, setOtpCode, clearOtp } = otpSlice.actions;
export default otpSlice.reducer;
