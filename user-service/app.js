const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const { initRabbitMQ } = require('./src/config/rabbitmq')

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
// Routes
app.use('/user', userRoutes);

// Initialize RabbitMQ listener
initRabbitMQ();

app.listen(3001,'0.0.0.0', () => console.log('User service running on port 3001'));
