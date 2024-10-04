const amqp = require('amqplib/callback_api');
require('dotenv').config();

let channel;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';

const initRabbitMQ = (queueName) => {
    const maxRetries = 5; // Maximum retries
    let attempt = 0;

    const connect = () => {
        amqp.connect(RABBITMQ_URL, (error0, connection) => {
            if (error0) {
                console.error('Error connecting to RabbitMQ:', error0.message);
                attempt++;

                if (attempt <= maxRetries) {
                    console.log(`Retrying RabbitMQ connection... (${attempt}/${maxRetries})`);
                    setTimeout(connect, 2000); // Retry after 2 seconds
                } else {
                    throw new Error('Could not connect to RabbitMQ after multiple attempts.');
                }
                return;
            }

            connection.createChannel((error1, ch) => {
                if (error1) {
                    console.error('Error creating RabbitMQ channel:', error1.message);
                    return;
                }

                channel = ch;
                channel.assertQueue(queueName, { durable: false });
                console.log(`RabbitMQ: Waiting for messages in ${queueName}`);

                // Optional: Handle incoming messages
                channel.consume(queueName, (msg) => {
                    if (msg !== null) {
                        console.log(`Received message: ${msg.content.toString()}`);
                        channel.ack(msg); // Acknowledge the message
                    }
                });
            });
        });
    };

    connect(); // Initial connection attempt
};

const sendToQueue = (queue, message) => {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Sent message to ${queue}:`, message); // Log sent message
};

module.exports = { initRabbitMQ, sendToQueue };
