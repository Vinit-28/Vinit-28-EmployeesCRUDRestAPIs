// Importing Dependencies //
const mongoose = require('mongoose');
const DB_CONNECTION = require('../Configs/DB_Connection').getDBConnectionObject(process.env.DB_NAME);
const {isEmail} = require('validator');


const EmployeesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Employee name is required.']
    },
    email: {
        type: String,
        required: [true, 'Email Id is required.'],
        unique: true,
        validate: [isEmail, 'Email Id is not valid.']
    },
    department: {
        type: String,
        default: 'IT'
    },
    salary: {
        type: Number,
        default: 25000
    }
});

module.exports = {
    EmployeesModel: DB_CONNECTION.model('employees', EmployeesSchema)
}