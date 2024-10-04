const express = require('express');
const { initRabbitMQ } = require('./src/config/rabbitmq');
const { consumeNotifications } = require('./src/services/rabbitmqService');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize RabbitMQ and start consuming messages
initRabbitMQ()
  .then(() => {
    console.log('RabbitMQ Initialized');
    consumeNotifications();  // Start listening for task notifications
  })
  .catch((err) => {
    console.error('Error initializing RabbitMQ:', err);
  });

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
