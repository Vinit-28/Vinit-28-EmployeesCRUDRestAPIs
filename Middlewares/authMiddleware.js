// Importing Dependencies //
const { compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../Configs/redisConnection').getRedisClient("Auth Middleware");


const authenticateUser = (req, res, next)=>{
    let token = req.headers['authorization'] || req.cookies.authToken;
    // let token = req.cookies.token;
    if( !token ){
        res.status(400).json({"Message":"Authentication Token Missing."});
    }
    else{
        token = token.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_SECRET, {issuer:process.env.JWT_ISSUER}, async (err, decodedObject)=>{
            if(err){
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