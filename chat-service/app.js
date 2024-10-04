const express = require('express');
const http = require('http');
const mongoose = require('mongoose');  // MongoDB connection
const cors = require('cors');
const { Server } = require('socket.io');
const { initRabbitMQ } = require('./src/config/rabbitmq');
const chatService = require('./src/services/chatService');
const chatRoutes = require('./src/routes/chatRoutes');
const socketAuth = require('./src/middleware/auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register chat routes for REST API
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);

// Initialize WebSocket server with CORS support
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

// Apply JWT authentication middleware to WebSocket connections
io.use(socketAuth);

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log(`User ${socket.user.id} connected`);

    socket.on('joinTaskRoom', async ({ taskId }) => {
        socket.join(taskId);
        await chatService.addUserToTaskRoom(taskId, socket.user.id);
        console.log(`User ${socket.user.id} joined task room ${taskId}`);
        socket.to(taskId).emit('userJoined', { userId: socket.user.id });
    });

    socket.on('sendMessage', ({ taskId, message }) => {
        const chatMessage = {
            userId: socket.user.id,
            message,
            timestamp: new Date()
        };
        io.in(taskId).emit('receiveMessage', chatMessage);
    });

    socket.on('disconnect', async () => {
        console.log(`User ${socket.user.id} disconnected`);
        await chatService.removeUserFromTaskRoom(taskId, socket.user.id);
    });
});

// Initialize RabbitMQ
initRabbitMQ('task_chat_queue')
  .then(() => console.log('RabbitMQ for chat service initialized'))
  .catch(err => console.error('Error initializing RabbitMQ:', err));

// Start the chat service
const PORT = process.env.PORT || 3004;
server.listen(PORT,'0.0.0.0', () => {
    console.log(`Chat service running on port ${PORT}`);
});
