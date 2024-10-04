const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const { initRabbitMQ } = require('./src/config/rabbitmq');
require('dotenv').config();

const app = express();
app.use(cors());
// Middleware for parsing JSON data
app.use(bodyParser.json());

// Routes for authentication
app.use('/auth', authRoutes);

// Sync database and connect RabbitMQ
sequelize.sync().then(() => console.log('MySQL connected'));
initRabbitMQ('user_creation_queue');

// Start the server
app.listen(3000,'0.0.0.0', () => console.log('Auth service running on port 3000'));
