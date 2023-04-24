// Importing Dependencies //
const router = require('express').Router();
const employeeController = require("../Controllers/employeeController");
const rateLimitter = require('express-rate-limit');
const limiter = rateLimitter({
    windowMs: 10000,
    max: 5
});

router.route("/")
    .get(limiter, employeeController.getEmployee)
    .post(limiter, employeeController.addEmployee)
    .put(limiter, employeeController.updateEmployee)
    .delete(limiter, employeeController.deleteEmployee);


router.all("/all", limiter, employeeController.getAllEmployees);

module.exports = router;