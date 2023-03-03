// Importing Dependencies //
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {UsersModel} = require("../Models/usersModel");
const saltRounds = 10;

// APIs //
const register = (req, res)=>{
    const {username, password, description} = req.body;
    if( !username || !password ){
        res.status(400).json({"Message":"Username & Password are required."});
        return;
    }
    UsersModel.findOne({username:username})
    .then(user=>{
        if( !user ){
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
            .catch(err=>{res.status(500).json({"Message":`Some Internal Server Error, ${err}.`})});
        }
        else{
            res.status(400).json({"Message":"Username already exists."});
        }
    })
    .catch(err=>{res.status(500).json({"Message":`Some Internal Server Error, ${err}.`})});
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
                res.cookie('token', authToken, {httpOnly:true, maxAge:60*60*60});
                // res.cookie('username', username, {httpOnly:true, maxAge:60*60*60});
                res.status(200).json({authToken});
            }
            else{
                res.status(400).json({"Message":"Invalid password."});
            }
        })
        .catch(err=>{res.status(500).json({"Message":`Some Internal Server Error, ${err}.`})});
    })
    .catch(err=>{res.status(500).json({"Message":`Some Internal Server Error, ${err}.`})});
};


const logout = async (req, res)=>{
    let {token, username} = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {issuer:process.env.JWT_ISSUER}, async (err, user)=>{
        if(err){
            res.status(400).json({"Message":`Invalid auth token provided.`});
            return;
        }
        else if( !user || user.username !== username ){
            res.status(401).json({"Message":"Authentication failed."});
            return;
        }
        res.cookie('token', '', {httpOnly:true, maxAge:1});    
        res.status(200).json({"Message":"Logged out successfully."})
    });
}


module.exports = {
    register,
    login,
    logout
}