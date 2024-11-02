import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('chatUser')) || null,
  ad: JSON.parse(localStorage.getItem('chatAd')) || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserAndAd: (state, action) => {
      state.user = action.payload.user;
      state.ad = action.payload.ad;
    },
    clearUserAndAd: (state) => {
      state.user = null;
      state.ad = null;
      localStorage.removeItem('chatUser');
      localStorage.removeItem('chatAd');
    },
  },
});


export const { setUserAndAd, clearUserAndAd } = userSlice.actions;
export default userSlice.reducer;
