const Task = require('../models/Task');
const { sendTaskUpdateNotification } = require('../services/rabbitmqService');

// CREATE a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;
        const newTask = new Task({ title, description, assignedTo });
        await newTask.save();
        console.log('Task created in MongoDB');

        sendTaskUpdateNotification({ taskId: newTask._id, action: 'create' });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
};

// READ a specific task by ID
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve task' });
    }
};

// READ ALL tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};

// UPDATE a task
exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

        sendTaskUpdateNotification({ taskId: updatedTask._id, action: 'update' });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};

// DELETE a task
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });

        sendTaskUpdateNotification({ taskId: req.params.id, action: 'delete' });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
