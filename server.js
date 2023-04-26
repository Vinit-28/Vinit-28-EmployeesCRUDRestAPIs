// Importing Dependencies //
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const responseTime = require('response-time');
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
// app.use(responseTime());


// Routes without authentication //
app.all('/', (req, res)=>{res.status(200).json({"Message":"This is Employees CRUD Rest APIs."})});
app.use('/auth', authRouter);


// Custom Middlewares //
app.use(authenticateUser);


// Routes with authentication //
app.use('/employees', employeeRouter);


// Listening for requests //
app.listen(PORT, ()=>{
    console.log(`Server is listening @ http://localhost:${PORT}`);
});