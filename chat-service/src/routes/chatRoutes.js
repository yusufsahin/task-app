const express = require('express');
const { getUsersInTaskRoom } = require('../services/chatService');
const router = express.Router();

// Get users in a specific task room
router.get('/task/:taskId/users', async (req, res) => {
    const taskId = req.params.taskId;
    const users = await getUsersInTaskRoom(taskId);  // Fetch from in-memory or MongoDB
    res.json(users);
});

module.exports = router;
