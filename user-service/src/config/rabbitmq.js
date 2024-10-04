const amqp = require('amqplib/callback_api');
require('dotenv').config();

let channel;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';

const initRabbitMQ = (queueName) => {
    amqp.connect(RABBITMQ_URL, (error0, connection) => {
        if (error0) {
            console.error('Error connecting to RabbitMQ:', error0);
            return;
        }

        connection.createChannel((error1, ch) => {
            if (error1) {
                console.error('Error creating channel:', error1);
                return;
            }

            channel = ch;
            // Ensure the queue is declared as non-durable
            channel.assertQueue(queueName, { durable: false });
            console.log(`RabbitMQ: Listening for messages in ${queueName}`);
        });
    });
};

const sendToQueue = (queue, message) => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};

module.exports = { initRabbitMQ, sendToQueue };


