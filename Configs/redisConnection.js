const redis = require('redis');


const getRedisClient = (requestedBy='Anonymous') => {
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
    redisClient.connect();
    return redisClient;
};

// const redisClient = redis.createClient();
// redisClient.on('error', err=>{
//     console.log(`Error (${err}) while connecting to Redis.`);
// });
// redisClient.on('connect', ()=>{
//     console.log(`Initiating the connection with Redis.`);
// });
// redisClient.on('ready', ()=>{
//     console.log(`Redis client is ready to use.`);
// });
// redisClient.connect();


module.exports = {
    getRedisClient
};

// module.exports = {
//     redisClient
// };