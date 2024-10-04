const { sendToQueue } = require('../config/rabbitmq');

exports.emitUserCreationEvent = (userProfile) => {
    sendToQueue('user_creation_queue', userProfile);
};
