const { getChannel } = require('../config/rabbitmq');
const { sendEmail } = require('./emailService');  // Import the email service

// Function to send RabbitMQ notification
const sendNotification = (message) => {
  try {
    const channel = getChannel();
    const queue = 'task_notifications';

    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log('Notification message sent to RabbitMQ:', message);
  } catch (error) {
    console.error('Failed to send RabbitMQ message:', error);
  }
};

// Function to listen to RabbitMQ queue and process messages
const consumeNotifications = () => {
  try {
    const channel = getChannel();
    const queue = 'task_notifications';

    channel.assertQueue(queue, { durable: false });
    channel.consume(queue, (msg) => {
      const messageContent = JSON.parse(msg.content.toString());
      console.log('Received notification message:', messageContent);

      // Send the email notification when a task update is received
      const emailText = `Task Update: A task with ID ${messageContent.taskId} has been ${messageContent.action}.`;
      sendEmail('user@example.com', 'Task Update Notification', emailText); // Modify 'user@example.com' with actual user
    }, { noAck: true });
  } catch (error) {
    console.error('Failed to consume RabbitMQ message:', error);
  }
};

module.exports = { sendNotification, consumeNotifications };
