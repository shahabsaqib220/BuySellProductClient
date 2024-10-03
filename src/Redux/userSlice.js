import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  password: '',
  securityQuestions: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    setSecurityAnswers: (state, action) => {
      state.securityQuestions = action.payload;
    },
  },
});

export const { setUserDetails, setSecurityAnswers } = userSlice.actions;
export default userSlice.reducer;
