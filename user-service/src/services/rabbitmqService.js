const { createUserProfile } = require('../controllers/userController');
const { initRabbitMQ } = require('../config/rabbitmq');

initRabbitMQ();
