// Importing Dependencies //
const mongoose = require('mongoose');
const DB_CONNECTION = require('../Configs/DB_Connection').getDBConnectionObject(process.env.DB_NAME);

const EmployeesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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