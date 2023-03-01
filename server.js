//Importing Dependencies //
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

// Importing Routers //
const employeeRouter = require('./Routers/employeeRouter');
const authRouter = require('./Routers/authRouter');

// Importing Custom Middlewares //
const {authenticateUser} = require('./Middlewares/authMiddleware');

// Global Configurations //
const app = express();
const PORT = process.env.PORT;


// Pre-defined Middlewares //
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


// Routes without authentication //
app.use('/auth', authRouter);


// Custom Middlewares //
app.use(authenticateUser);


// Routes with authentication //
app.use('/employees', employeeRouter);


// Listening for requests //
app.listen(PORT, ()=>{
    console.log(`Server is listening @ http://localhost:${PORT}`);
});