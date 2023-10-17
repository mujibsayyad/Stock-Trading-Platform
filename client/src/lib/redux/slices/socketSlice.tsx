import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type MessagingState = {
  messages: string[];
  connected: boolean;
};

const initialState: MessagingState = {
  messages: [],
  connected: false,
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState: initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<string>) => {
      console.log('🚀 sendMessage ran:');
      console.log('🚀 sendMessage state:', state);
      console.log('🚀 sendMessage action:', action);
      state.messages.push(action.payload);
    },
    messageReceived: (state, action: PayloadAction<string>) => {
      console.log('🚀 messageReceived ran:');
      console.log('🚀 messageReceived action.payload:', action.payload);
      state.messages.push(action.payload);
    },
    connectSocket: (state) => {
      state.connected = true;
    },
    disconnectSocket: (state) => {
      console.log('🚀 disconnectSocket state:', state);
      state.connected = false;
    },
  },
});

export const { sendMessage, messageReceived, connectSocket, disconnectSocket } =
  messagingSlice.actions;

export default messagingSlice;
