const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err) => {
    console.error('Redis client error', err);
});

(async () => {
    try {
        await redisClient.connect();
        console.log('Redis client connection established');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();

module.exports = redisClient;
