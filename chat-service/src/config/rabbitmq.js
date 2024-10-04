const amqp = require('amqplib/callback_api');

let channel = null;

const initRabbitMQ = (queueName) => {
  return new Promise((resolve, reject) => {
    amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
      if (error0) {
        console.error('Error connecting to RabbitMQ:', error0);
        return reject(error0);
      }

      connection.createChannel((error1, ch) => {
        if (error1) {
          console.error('Error creating RabbitMQ channel:', error1);
          return reject(error1);
        }

        console.log(`RabbitMQ channel for queue ${queueName} created successfully`);
        channel = ch;
        resolve(channel);
      });
    });
  });
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized. Call initRabbitMQ first.');
  }
  return channel;
};

module.exports = { initRabbitMQ, getChannel };
