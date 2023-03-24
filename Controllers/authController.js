// Importing Dependencies //
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pwValidator = new (require('password-validator'))();
const {UsersModel} = require("../Models/usersModel");
const {modelsErrorHandler} = require('../ErrorHandlers/validationErrorHandler');
const redisClient = require('../Configs/redisConnection').getRedisClient("Auth");
const saltRounds = 10;


// Setting up Password-Validator //
pwValidator
.is().min(8)
.is().max(30)
.has().uppercase()
.has().lowercase()
.has().digits(1)
.has().symbols(1);



// APIs //
const register = (req, res)=>{
    const {username, password, description} = req.body;
    if( pwValidator.validate(password) ){
        bcrypt.hash(password, saltRounds)
        .then(async hashedPwd=>{
            const newUser = UsersModel({
                username: username,
                password: hashedPwd
            });
            newUser.description = description || newUser.description;
            await newUser.save();
            res.status(200).json({"Message":"User account created successfully."});
        })
        .catch(err=>{
            modelsErrorHandler(err, res);
        });
    }
    else{
        res.status(400).json({"Message":"Password length should be between 8-30 characters & should consists of atleast 1 lowercase, 1 uppercase & 1 special symbol(#,@,$,&)."});
    }
};


const login = (req, res)=>{
    const {username, password} = req.body;
    if( !username || !password ){
        res.status(400).json({"Message":"Username & Password are required."});
        return;
    }
    UsersModel.findOne({username:username})
    .then(user=>{
        if( !user ){
            res.status(400).json({"Message":"Invalid username."});
            return;
        }
        bcrypt.compare(password, user.password)
        .then(result=>{
            if( result ){
                const authToken = jwt.sign({
                    username: user.username,
                    description: user.description
                }, process.env.JWT_SECRET, {expiresIn:'1h', issuer:process.env.JWT_ISSUER});
                res.cookie('authToken', authToken, {httpOnly:true, maxAge:60*60*60});
                res.status(200).json({authToken});
            }
            else{
                res.status(400).json({"Message":"Invalid password."});
            }
        });
    })
    .catch(err=>{res.status(500).json({"Message":`Some Internal Server Error, ${err}.`})});
};


const logout = async (req, res)=>{
    let token = req.headers['authorization'] || req.cookies.authToken;
    let now = Math.floor(Date.now()/1000);
    let tokenInvalidity = req.decodedJWTObject.exp - now;
    redisClient.set(token, 1, {EX: tokenInvalidity});
    res.cookie('authToken', '', {httpOnly:true, maxAge:1});    
    res.status(200).json({"Message":"Logged out successfully."});
}


module.exports = {
    register,
    login,
    logout
}