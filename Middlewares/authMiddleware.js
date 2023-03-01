const jwt = require('jsonwebtoken');


const authenticateUser = (req, res, next)=>{
    let {token, username} = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {issuer:process.env.JWT_ISSUER}, (err, user)=>{
        if(err){
            res.status(400).json({"Message":`Invalid auth token provided.`});
            return;
        }
        else if( !user || user.username !== username ){
            res.status(401).json({"Message":"Authentication failed."});
            return;
        }
        next();
    });
};

module.exports = {
    authenticateUser
};