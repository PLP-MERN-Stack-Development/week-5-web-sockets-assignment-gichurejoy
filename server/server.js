// server.js - Main server file for Socket.io chat application

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5174", // Updated port
    methods: ["GET", "POST"]
  },
  transports: ['websocket'],
  upgrade: false
});

// Middleware
app.use(cors());
app.use(express.json());

// Store connected users and messages
const connectedUsers = new Map();
const messages = [];
const privateMessages = new Map(); // userId -> [messages]

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user authentication
  socket.on('authenticate', (username) => {
    connectedUsers.set(socket.id, {
      username,
      id: socket.id,
      isTyping: false
    });

    // Broadcast user joined
    io.emit('userJoined', {
      username,
      id: socket.id,
      users: Array.from(connectedUsers.values())
    });
  });

  // Handle chat messages
  socket.on('sendMessage', (message) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const messageData = {
        text: message,
        user: user.username,
        id: socket.id,
        timestamp: new Date(),
        reactions: {}
      };
      messages.push(messageData);
      io.emit('message', messageData);
    }
  });

  // Handle private messages
  socket.on('sendPrivateMessage', ({ recipientId, message }) => {
    const sender = connectedUsers.get(socket.id);
    const recipient = connectedUsers.get(recipientId);

    if (sender && recipient) {
      const messageData = {
        text: message,
        senderId: socket.id,
        senderName: sender.username,
        recipientId,
        recipientName: recipient.username,
        timestamp: new Date(),
        reactions: {}
      };

      // Store private messages
      if (!privateMessages.has(socket.id)) {
        privateMessages.set(socket.id, []);
      }
      if (!privateMessages.has(recipientId)) {
        privateMessages.set(recipientId, []);
      }
      privateMessages.get(socket.id).push(messageData);
      privateMessages.get(recipientId).push(messageData);

      // Send to both sender and recipient
      io.to(socket.id).emit('privateMessage', messageData);
      io.to(recipientId).emit('privateMessage', messageData);
    }
  });

  // Handle message reactions
  socket.on('addReaction', ({ messageId, reaction }) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        if (!message.reactions[reaction]) {
          message.reactions[reaction] = [];
        }
        if (!message.reactions[reaction].includes(user.username)) {
          message.reactions[reaction].push(user.username);
          io.emit('messageReaction', { messageId, reactions: message.reactions });
        }
      }
    }
  });

  // Handle file sharing
  socket.on('shareFile', ({ file, fileName, fileType }) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const fileData = {
        file,
        fileName,
        fileType,
        senderId: socket.id,
        senderName: user.username,
        timestamp: new Date()
      };
      io.emit('fileShared', fileData);
    }
  });

  // Handle typing status
  socket.on('typing', (isTyping) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.isTyping = isTyping;
      socket.broadcast.emit('userTyping', {
        username: user.username,
        isTyping
      });
    }
  });

  // Handle message search
  socket.on('searchMessages', (query) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const results = messages.filter(msg =>
        msg.text.toLowerCase().includes(query.toLowerCase())
      );
      socket.emit('searchResults', results);
    }
  });

  // Handle loading previous messages
  socket.on('loadPreviousMessages', ({ page, limit }) => {
    const start = page * limit;
    const end = start + limit;
    const previousMessages = messages.slice(start, end);
    socket.emit('previousMessages', {
      messages: previousMessages,
      hasMore: end < messages.length
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      io.emit('userLeft', {
        username: user.username,
        id: socket.id,
        users: Array.from(connectedUsers.values())
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 