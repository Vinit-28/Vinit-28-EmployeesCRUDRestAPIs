// Importing Dependencies //
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

// Importing Routers //
const employeeRouter = require('./Routers/employeeRouter');
const authRouter = require('./Routers/authRouter');
const redisClient = require('./Configs/redisConnection').getRedisClient("Main");

// Importing Custom Middlewares //
const {authenticateUser} = require('./Middlewares/authMiddleware');

// Global Configurations //
const app = express();
const PORT = process.env.PORT;


// Pre-defined Middlewares //
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


// Routes without authentication //
app.all('/', (req, res)=>{res.status(200).json({"Message":"This is Employees CRUD Rest APIs."})});
app.get('/set-cache', async (req, res)=>{
    let key = req.query.key;
    let value = req.query.value;
    console.log("Redis Client : ", redisClient);
    await redisClient.set(key, value, {EX:5});
    res.status(200).json({'Message':'Cookie is set successfully.'});
});
app.get('/get-cache', async (req, res)=>{
    let key = req.query.key;
    let value = await redisClient.get(key);
    res.status(200).json({key:value});
});

app.use('/auth', authRouter);


// Custom Middlewares //
app.use(authenticateUser);


// Routes with authentication //
app.use('/employees', employeeRouter);


// Listening for requests //
app.listen(PORT, ()=>{
    console.log(`Server is listening @ http://localhost:${PORT}`);
});