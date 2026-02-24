const { io } = require('socket.io-client');

const socket = io('ws://localhost:8080/chat', {
  query: { userId: '123' },
  transports: ['websocket', 'polling'] // Try explicitly specifying transports
});

socket.on('connect', () => {
  console.log('Connected: ', socket.id);
  process.exit(0);
});

socket.on('connect_error', (err) => {
  console.error('Connection Error: ', err.message);
  process.exit(1);
});

setTimeout(() => {
  console.error('Timeout connecting to WebSocket');
  process.exit(1);
}, 3000);
