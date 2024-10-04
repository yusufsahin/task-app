const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile;
