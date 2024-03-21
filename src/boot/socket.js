import { io } from 'socket.io-client';
const socket = io('sweetchat-production.up.railway.app');

export function emit(data, callback) {
  socket.emit('chat message', {
    users_id: data.user,
    rooms_id: data.room,
    messages: data.message,
    color: data.color
  }, (message) => callback(message));
}

export function listenForMessages(callback) {
  socket.on('chat message',(message) => callback(message));
}