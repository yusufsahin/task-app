const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const taskRoutes = require('./src/routes/taskRoutes');
const { initRabbitMQ } = require('./src/config/rabbitmq');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Initialize RabbitMQ
initRabbitMQ()
  .then(() => {
    console.log('RabbitMQ Initialized');
  })
  .catch((err) => {
    console.error('Error initializing RabbitMQ:', err);
  });

// Routes
app.use('/api/tasks', taskRoutes);

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Task service running on port ${PORT}`);
});
