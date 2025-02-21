// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Redux/userSlice';
import otpReducer from '../Redux/otpSlice';
import authReducer from './authSlice'; // Corrected import
import ChatReducer from "./usersChatSlice"
import messageReducer from './messageSlice';
import searchReducer from './searchSlice';


const store = configureStore({
  reducer: {
    userreg: userReducer,
    otp: otpReducer,
    auth: authReducer, // Corrected reducer assignment
    user: ChatReducer,
    messages: messageReducer,
    search: searchReducer
  },
});

export default store;