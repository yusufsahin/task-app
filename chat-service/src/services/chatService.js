const chatRooms = new Map();  // In-memory store for users in task chat rooms
const UserRoomModel = require('../models/UserRoom');  // MongoDB model for storing users in rooms

// Add user to task room (with MongoDB persistence)
const addUserToTaskRoom = async (taskId, userId) => {
    try {
        // Add to in-memory store
        if (!chatRooms.has(taskId)) {
            chatRooms.set(taskId, new Set());
        }
        const usersInRoom = chatRooms.get(taskId);
        usersInRoom.add(userId);
        console.log(`User ${userId} added to in-memory room ${taskId}`);

        // Persist to MongoDB
        await UserRoomModel.updateOne(
            { taskId }, 
            { $addToSet: { users: userId } }, 
            { upsert: true }
        );
        console.log(`User ${userId} added to MongoDB room ${taskId}`);
    } catch (err) {
        console.error('Error adding user to task room:', err);
    }
};

// Remove user from task room (with MongoDB persistence)
const removeUserFromTaskRoom = async (taskId, userId) => {
    try {
        // Remove from in-memory store
        if (chatRooms.has(taskId)) {
            const usersInRoom = chatRooms.get(taskId);
            usersInRoom.delete(userId);
            console.log(`User ${userId} removed from in-memory room ${taskId}`);
        }

        // Persist to MongoDB
        await UserRoomModel.updateOne(
            { taskId }, 
            { $pull: { users: userId } }
        );
        console.log(`User ${userId} removed from MongoDB room ${taskId}`);
    } catch (err) {
        console.error('Error removing user from task room:', err);
    }
};

// Get users in a specific task room (with MongoDB fallback)
const getUsersInTaskRoom = async (taskId) => {
    try {
        // First, check the in-memory store
        if (chatRooms.has(taskId)) {
            const usersInRoom = Array.from(chatRooms.get(taskId));
            if (usersInRoom.length > 0) {
                return usersInRoom;
            }
        }

        // If not in memory, retrieve from MongoDB
        const roomData = await UserRoomModel.findOne({ taskId });
        return roomData ? roomData.users : [];
    } catch (err) {
        console.error('Error getting users in task room:', err);
        return [];
    }
};

module.exports = { addUserToTaskRoom, removeUserFromTaskRoom, getUsersInTaskRoom };

