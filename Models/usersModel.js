// Importing Dependencies //
const mongoose = require('mongoose');
const DB_CONNECTION = require('../Configs/DB_Connection').getDBConnectionObject(process.env.DB_NAME);

const UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        minlength: [4, 'Username should consists of minimum 4 characters']
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [8, 'Password should consists of minimum 8 characters']
    },
    description: {
        type: String,
        default: "You make my software turn into hardware!"
    }
});

module.exports = {
    UsersModel: DB_CONNECTION.model('users', UsersSchema)
}