import http from 'http';
import { Server } from 'socket.io';
import app from './index.js';
import { connectToDb } from './src/config/db.js';

const PORT = 8000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Map to store roomID for each user
const userRooms = new Map();

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle joining a room
  socket.on('join-room', ({ roomID }) => {
    console.log(`User joined room: ${roomID}`);
    socket.join(roomID);
    userRooms.set(socket.id, roomID); // Map socket.id to roomID
  });

  // Handle messages
  socket.on('message', (data) => {
    console.log('Message:', data);
    // Broadcast the message to all connected clients in the room
    io.to(userRooms.get(socket.id)).emit('message', data);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    const roomID = userRooms.get(socket.id);
    if (roomID) {
      socket.leave(roomID);
      userRooms.delete(socket.id);
    }
  });
});

server.listen(PORT, async () => {
  await connectToDb();
  console.log(`Server is live at PORT ${PORT}`);
});
