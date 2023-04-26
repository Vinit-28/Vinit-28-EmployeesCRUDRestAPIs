// Importing Dependencies //
const {EmployeesModel} = require('../Models/employeesModel');
const {modelsErrorHandler} = require('../ErrorHandlers/validationErrorHandler');
const redis = require('../Configs/redisConnection');
var redisClient = null;


// Connecting with Redis Server //
redis.getRedisClient("Employees Conrtoller")
.then((client)=>{
    redisClient = client;
});


// Utility Functions //
const clearCache = (...keys)=>{
    for(let key of keys){
        redisClient.set(key, '', {EX: 60});
    }
}


// APIs //
const getEmployee = async (req, res)=>{
    let email = req.body.email || '', name = req.body.name || '';
    let cachedDataEmail = await redisClient.get(email);
    let cachedDataName = await redisClient.get(name);
    let data = null;

    if( cachedDataEmail || cachedDataName ){
        console.log("Using Cached data.");
        data = JSON.parse(cachedDataEmail || cachedDataName);
    }
    else{
        data = await EmployeesModel.find({$or:[{name:name}, {email:email}]}).exec();
        console.log("Caching data.")
        if( email )
            redisClient.set(email, JSON.stringify(data), {EX: 60});
        if( name )
            redisClient.set(name, JSON.stringify(data), {EX: 60});
    }

    return res.status(200).json(data);
};


const getAllEmployees = async (req, res)=>{
    const key = 'allEmployees';
    let cachedData = await redisClient.get(key);
    
    if( cachedData ){
        console.log("Using Cached data.");
        let data = JSON.parse(cachedData);
        res.status(200).json(data);
    }
    else{        
        EmployeesModel.find({}, {_id:false, name:true, email:true, salary:true})
        .then(data=>{
            console.log("Caching data.")
            redisClient.set(key, JSON.stringify(data), {EX: 60});
            res.status(200).json(data);
        })
        .catch((err)=>{
            modelsErrorHandler(err, res);
        });
    }
};


const addEmployee = (req, res)=>{
    const newEmployee = new EmployeesModel({
        name: req.body.name,
        email: req.body.email,
        department: req.body.department,
        salary: req.body.salary,
    });
    newEmployee.save()
    .then(empObj=>{
        clearCache('allEmployees');
        res.status(200).json(empObj);
    })
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
        .then(employee=>{
            clearCache('allEmployees', email, name);
            res.status(202).json(employee);
        })
        .catch(err=>{
            modelsErrorHandler(err, res);
        });
    })
    .catch(err=>{
        modelsErrorHandler(err, res);
    });
};


const deleteEmployee = async (req, res) => {
    let filter = {email:req.body.email};
    if( !filter.email ){
        req.status(400).json({"Message":"Please provide email id."});
        return;
    }
    employee = await EmployeesModel.findOne(filter)
    .then(employee=>{
        if( !employee ){
            let err = new Error(`Not able to find employee with email ${filter.email}.`);
            err.isCustomError = true;
            throw err;
        }
        else{
            EmployeesModel.deleteOne(filter)
            .then(result=>{
                if(!result.deletedCount){
                    let err = new Error(`Not able to delete employee with email ${filter.email}.`);
                    err.isCustomError = true;
                    throw err;
                }
                clearCache('allEmployees', employee.email, employee.name);
                res.status(200).json({"Message":`Employee with email ${filter.email} is deleted.`})
            });
        }
    })
    .catch(err=>{
        modelsErrorHandler(err, res);
    });
};


module.exports = {
    getEmployee,
    getAllEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
};