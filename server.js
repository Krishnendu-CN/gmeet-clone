const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for WebSocket and HTTP
const io = socketIo(server, {
  cors: {
    origin: 'https://gmeet-clone-frontend-kqb9n69n8-krishnendu-pauls-projects.vercel.app', // React frontend URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store users' streams and their socket ids
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a user starts a video stream, broadcast it to all other users
  socket.on('video-stream', (data) => {
    users[socket.id] = data.stream;

    // Emit the stream to all other users except the sender
    socket.broadcast.emit('video-stream', { id: socket.id, stream: data.stream });
  });

  // Handle call end
  socket.on('end-call', () => {
    console.log('Call ended by', socket.id);
    io.emit('call-ended');  // Notify all users to end the call
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete users[socket.id]; // Remove the user's stream
    socket.broadcast.emit('user-disconnected', { id: socket.id }); // Notify others about the disconnection
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Server running on port 5000');
});
