import { io, Socket } from 'socket.io-client';
import {
  sendMessage,
  messageReceived,
  connectSocket,
  disconnectSocket,
} from '@/lib/redux/slices/socketSlice';
import { MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';

export const socket: Socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
  autoConnect: false,
  withCredentials: true,
});

const socketMiddleware =
  (store: MiddlewareAPI) =>
  (next: Dispatch<AnyAction>) =>
  (action: AnyAction) => {
    switch (action.type) {
      case sendMessage.type:
        socket.emit('sendMessage', action.payload);
        return;
      case connectSocket.type:
        socket.connect();
        socket.on('receiveMessage', (message: string) => {
          store.dispatch(messageReceived(message));
        });
        return;
      case disconnectSocket.type:
        socket.disconnect();
        return;
      default:
        return next(action);
    }
  };

export default socketMiddleware;
