const mongoose = require('mongoose');

const UserRoomSchema = new mongoose.Schema({
    taskId: { type: String, required: true },
    users: { type: [String], default: [] }  // Array of user IDs
});

const UserRoom = mongoose.model('UserRoom', UserRoomSchema);

module.exports = UserRoom;

