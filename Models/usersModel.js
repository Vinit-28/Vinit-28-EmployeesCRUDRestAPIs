// Importing Dependencies //
const mongoose = require('mongoose');
const DB_CONNECTION = require('../Configs/DB_Connection').getDBConnectionObject(process.env.DB_NAME);

const UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "You make my software turn into hardware!"
    }
});

module.exports = {
    UsersModel: DB_CONNECTION.model('users', UsersSchema)
}