import http from 'http';
import { Server } from 'socket.io';
import app from './index.js';
import { connectToDb } from './src/config/db.js';

const PORT = 8000;

const server = http.createServer(app);
const io = new Server(server);

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle messages
  socket.on('message', (data) => {
    console.log('Message:', data);
    // Broadcast the message to all connected clients
    io.emit('message', data);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, async () => {
  await connectToDb();
  console.log(`Server is live at PORT ${PORT}`);
});
