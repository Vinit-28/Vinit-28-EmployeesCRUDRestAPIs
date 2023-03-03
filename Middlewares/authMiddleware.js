// Importing Dependencies //
const jwt = require('jsonwebtoken');


const authenticateUser = (req, res, next)=>{
    let token = req.headers['authorization'];
    // let token = req.cookies.token;
    if( !token ){
        res.status(400).json({"Message":"Authentication Token Missing."});
    }
    else{
        token = token.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_SECRET, {issuer:process.env.JWT_ISSUER}, (err, user)=>{
            if(err){
                res.status(401).json({"Message":`You're Unauthorized.`});
            }
            else{
                next();
            }
        });
    }
};

module.exports = {
    authenticateUser
};