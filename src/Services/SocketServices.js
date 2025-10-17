import {io} from 'socket.io-client';
import {socketURL} from '../Utils/Urls';
import {store} from '../Redux/Reducer';
// Replace with your Node.js socket server URL
// const SOCKET_URL = "http://localhost:4000";

export const socket = io(socketURL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
});

const initSocket = userId => {
  socket.on('connect', () => console.log('Socket connected:', socket.id));
  const {Auth} = store.getState();
  const userIdFromStore = Auth?.userData?.id;
  const userIdToUse = userId || userIdFromStore;
  if (userIdFromStore) {
    socket.emit('join_room', userIdFromStore);
    console.log('Joined socket with user id:', userIdFromStore);
  }

  // Debugging
  socket.on('disconnect', () => console.log('Socket disconnected'));
  socket.on('error', err => console.error('Socket error:', err));

  return socket;
};

export default initSocket;
