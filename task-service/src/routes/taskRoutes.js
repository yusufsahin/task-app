const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');  // Ensure JWT middleware is available

const router = express.Router();

// Task CRUD routes
router.post('/create', authMiddleware, taskController.createTask);
router.get('/:id', authMiddleware, taskController.getTask);
router.get('/', authMiddleware, taskController.getAllTasks);
router.put('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;
