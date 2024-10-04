const express = require('express');
const { getUserProfile } = require('../controllers/userController');
const router = express.Router();

router.get('/profile/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const profile = await getUserProfile(email);
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ message: 'User profile not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
