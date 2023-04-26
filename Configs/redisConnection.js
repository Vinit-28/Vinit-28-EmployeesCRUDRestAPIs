const redis = require('redis');


const getRedisClient = async (requestedBy='Anonymous') => {
    let redisClient = redis.createClient();
    redisClient.on('error', err=>{
        console.log(`Error (${err}) while connecting to Redis, service was requested by ${requestedBy}.`);
    });
    redisClient.on('connect', ()=>{
        console.log(`Initiating the connection with Redis, service was requested by ${requestedBy}.`);
    });
    redisClient.on('ready', ()=>{
        console.log(`Redis client is ready to use, service was requested by ${requestedBy}.`);
    });
    await redisClient.connect();
    return redisClient;
};

module.exports = {
    getRedisClient
};