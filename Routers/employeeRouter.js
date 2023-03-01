const router = require('express').Router();
const employeeController = require("../Controllers/employeeController");


router.route("/")
    .get(employeeController.getEmployee)
    .post(employeeController.addEmployee)
    .put(employeeController.updateEmployee)
    .delete(employeeController.deleteEmployee);


router.all("/all", employeeController.getAllEmployee);

module.exports = router;