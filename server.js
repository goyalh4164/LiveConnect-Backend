import http from 'http';
import { Server } from 'socket.io';
import app from './index.js';
import { connectToDb } from './src/config/db.js';
import Message from './src/features/Messages/message.schema.js';

const PORT = 8000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Map to store socket IDs for each room
const roomSocketIDsMap = new Map();

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle joining a room
  socket.on('join-room', ({ roomID }) => {
    console.log(`User wants to join room: ${roomID}`);

    // Initialize array for the room if it doesn't exist
    if (!roomSocketIDsMap.has(roomID)) {
      roomSocketIDsMap.set(roomID, []);
    }

    // Add the socket ID to the array for the room
    roomSocketIDsMap.get(roomID).push(socket.id);

    // Emit 'joined-room' event to the socket
    socket.emit('joined-room', { roomID });
  });

  // Handle messages
  // Import the Message model
 // Update the path accordingly

socket.on('message', async (data) => {
  console.log(socket.id);
  console.log('Message:', data);
  const { senderID, receiverID, message } = data;

  // Save the message to MongoDB
  try {
    const savedMessage = await Message.findOneAndUpdate(
      { senderID, receiverID },
      { $push: { messages: message } },
      { upsert: true, new: true }
    );
    console.log('Message saved to MongoDB:', savedMessage);

    // Broadcast the message to all sockets in the room
    const roomID = data.roomID; // Assuming roomID is still part of the data
    if (roomSocketIDsMap.has(roomID)) {
      const socketIDsInRoom = roomSocketIDsMap.get(roomID);

      socketIDsInRoom.forEach((socketID) => {
        // Skip sending the message to the sender
        if (socketID !== socket.id) {
          io.to(socketID).emit('message', data);
        }
      });
    }
  } catch (error) {
    console.error('Error saving message to MongoDB:', error);
  }
});


  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');

    // Find the room that the socket is part of
    const roomID = Array.from(roomSocketIDsMap.entries())
      .find(([_, socketIDs]) => socketIDs.includes(socket.id))?.[0];

    if (roomID && roomSocketIDsMap.has(roomID)) {
      // Remove the socket ID from the array for the room
      const socketIDsInRoom = roomSocketIDsMap.get(roomID);
      const index = socketIDsInRoom.indexOf(socket.id);

      if (index !== -1) {
        socketIDsInRoom.splice(index, 1);
      }

      // If the room is empty, delete the room from the map
      if (socketIDsInRoom.length === 0) {
        roomSocketIDsMap.delete(roomID);
      }
    }
  });
});

server.listen(PORT, async () => {
  await connectToDb();
  console.log(`Server is live at PORT ${PORT}`);
});
