// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Redux/userSlice';
import otpReducer from '../Redux/otpSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    otp: otpReducer,
  },
});

export default store;
