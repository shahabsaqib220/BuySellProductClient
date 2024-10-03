import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const saveSecurityQuestions = createAsyncThunk(
  'security/saveQuestions',
  async (questions, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/save-security-questions', { questions });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const securityQuestionsSlice = createSlice({
  name: 'securityQuestions',
  initialState: {
    questions: [],
    success: false,
    error: null,
  },
  reducers: {
    setSecurityQuestions: (state, action) => {
      state.questions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveSecurityQuestions.fulfilled, (state) => {
        state.success = true;
        state.error = null;
      })
      .addCase(saveSecurityQuestions.rejected, (state, action) => {
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { setSecurityQuestions } = securityQuestionsSlice.actions;

export default securityQuestionsSlice.reducer;
