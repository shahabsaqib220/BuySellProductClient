// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Redux/userSlice';
import otpReducer from '../Redux/otpSlice';
import authReducer from './authSlice'; // Corrected import

const store = configureStore({
  reducer: {
    user: userReducer,
    otp: otpReducer,
    auth: authReducer, // Corrected reducer assignment
  },
});

export default store;
