// Importing Dependencies //
const {EmployeesModel} = require('../Models/employeesModel');
const {modelsErrorHandler} = require('../ErrorHandlers/validationErrorHandler');


// APIs //
const getEmployee = async (req, res)=>{
    let email = req.body.email || '', name = req.body.name || '';
    let data = await EmployeesModel.find({$or:[{name:name}, {email:email}]}).exec();
    return res.status(200).json(data);
};


const getAllEmployees = async (req, res)=>{
    EmployeesModel.find({}, {_id:false, name:true, email:true, salary:true})
    .then(data=>{res.status(200).json(data);})
    .catch((err)=>{
        modelsErrorHandler(err, res);
    });
};


const addEmployee = (req, res)=>{
    const newEmployee = new EmployeesModel({
        name: req.body.name,
        email: req.body.email,
        department: req.body.department,
        salary: req.body.salary,
    });
    newEmployee.save()
    .then(empObj=>{res.status(200).json(empObj)})
    .catch((err)=>{
        modelsErrorHandler(err, res);
    });
};


const updateEmployee = (req, res) => {
    let {name, email, salary, department, newEmail} = req.body;
    if( !email ){
        res.status(400).json({"Message":`Please provide employee's email id.`});
        return;
    }
    else if( !name && !salary && !department ){
        res.status(400).json({"Message":`Please provide some details to update.`});
        return;
    }
    let filter = {email};
    EmployeesModel.findOne(filter)
    .then(employee=>{
        if(!employee){
            let err = new Error("Email id doesn't exists.");
            err.isCustomError = true;
            throw err;
        } 
        employee.email = newEmail || employee.email;
        employee.name = name || employee.name;
        employee.salary = salary || employee.salary;
        employee.department = department || employee.department;
        employee.save()
        .then(employee=>{res.status(202).json(employee);})
        .catch(err=>{
            modelsErrorHandler(err, res);
        });
    })
    .catch(err=>{
        modelsErrorHandler(err, res);
    });
};


const deleteEmployee = (req, res) => {
    let filter = {email:req.body.email};
    if( !filter.email ){
        req.status(400).json({"Message":"Please provide email id."});
        return;
    }
    EmployeesModel.deleteOne(filter)
    .then(result=>{
        if(!result.deletedCount){
            let err = new Error(`Not able to delete/find employee with email ${filter.email}.`);
            err.isCustomError = true;
            throw err;
        }
        res.status(200).json({"Message":`Employee with email ${filter.email} is deleted.`})
    })
    .catch(err=>{
        modelsErrorHandler(err, res);
    })
};


module.exports = {
    getEmployee,
    getAllEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
};
