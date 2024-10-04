const { getChannel } = require('../config/rabbitmq');

const sendTaskUpdateNotification = (message) => {
  try {
    const channel = getChannel();
    const queue = 'task_updates';

    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log("Task update message sent to RabbitMQ", message);
  } catch (error) {
    console.error("Failed to send RabbitMQ message", error);
  }
};

module.exports = { sendTaskUpdateNotification };
