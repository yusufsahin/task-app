const express = require('express');
const { signup, signin } = require('../controllers/authController');
const router = express.Router();

// POST route for user signup
router.post('/signup', signup);

// POST route for user sign-in
router.post('/signin', signin);

module.exports = router;
