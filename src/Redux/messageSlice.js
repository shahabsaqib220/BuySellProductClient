// src/redux/messageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: []
};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        }
    }
});

export const { addMessage, setMessages, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
