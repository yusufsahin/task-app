const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const User = require('../models/User');
const { sendToQueue } = require('../config/rabbitmq');

exports.signup = async (req, res, next) => {
    const { email, password, firstname, lastname } = req.body;

    try {
        const hashedPassword = await hashPassword(password);
        const user = await User.create({ email, password: hashedPassword });

        // Emit event to user-service to create the user profile
        sendToQueue('user_creation_queue', { email, firstname, lastname });

        const token = generateToken(user);
        res.status(201).json({ token });
    } catch (error) {
        next(error); // Handle errors centrally
    }
};

exports.signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare entered password with stored hashed password
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return the token to the client
        res.status(200).json({ token });
    } catch (error) {
        next(error); // Handle errors centrally
    }
};
