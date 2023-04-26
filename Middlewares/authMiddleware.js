// Importing Dependencies //
const { compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('../Configs/redisConnection');
var redisClient = null;


// Connecting with Redis Server //
redis.getRedisClient("Auth Middleware")
.then((client)=>{
    redisClient = client;
});


const authenticateUser = async (req, res, next)=>{
    let token = req.headers['authorization'] || req.cookies.authToken;
    if( !token ){
        res.status(400).json({"Message":"Authentication Token Missing."});
    }
    else{
        token = token.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_SECRET, {issuer:process.env.JWT_ISSUER}, async (err, decodedObject)=>{
            if(err){
                console.log("Error : ", err);
                res.status(401).json({"Message":`You're Unauthorized.`});
            }
            else{
                let cacheTokenData = await redisClient.get(token);
                if( cacheTokenData ){
                    res.status(401).json({"Message":`You're already logged out.`});
                }
                else{
                    req.decodedJWTObject = decodedObject;
                    next();
                }
            }
        });
    }
};

module.exports = {
    authenticateUser
};