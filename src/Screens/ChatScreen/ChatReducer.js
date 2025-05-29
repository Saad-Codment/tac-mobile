import {createSlice} from '@reduxjs/toolkit';

// In your Redux slice (e.g., `chatSlice.js`):
const initialState = {
  messages: [],
  message: '',
  chatroomId: '',
  isLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateChatState: (state, action) => {
      state[action.payload.key] = action.payload.data;
    },
    resetChatState: () => initialState,
  },
});

export const {updateChatState, resetChatState} = chatSlice.actions;
export default chatSlice.reducer;
