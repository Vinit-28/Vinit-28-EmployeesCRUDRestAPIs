const {EmployeesModel} = require('../Models/employeesModel');



// APIs //
const getEmployee = async (req, res)=>{
    let email = req.body.email || '', name = req.body.name || '';
    console.log(email, name)
    let data = await EmployeesModel.find({$or:[{name:name}, {email:email}]}).exec();
    return res.status(200).json(data);
};


const getAllEmployee = async (req, res)=>{
    // Note* : Model.find() // returns a query object, if we call queryObject.getFilter() it will returns us the query filter that we passed. And if we call queryObject.exec(callback) it will execute the query. //

    // Using Async-Await //
    // let data = await EmployeesModel.find({}, {_id:false, name:true, email:true, salary:true});
    // res.status(200).json(data);

    // Using Callback //
    // EmployeesModel.find({}, {_id:false, name:true, email:true, salary:true}).exec((err, data)=>{
    //     if( err ){
    //         res.status(501).json({"Message":`Some Internal Error: ${err}.`});
    //     }
    //     else{
    //         res.status(200).json(data);
    //     }
    // });

    // Using Promises(then & catch) //
    EmployeesModel.find({}, {_id:false, name:true, email:true, salary:true})
    .then(data=>{res.status(200).json(data);})
    .catch(err=>{res.status(501).json({"Message":`Some Internal Error: ${err}.`});});
};


const addEmployee = (req, res)=>{
    if( !req.body.name || !req.body.salary || !req.body.department || !req.body.email ){
        res.status(200).json({"Message":`Employee details are required.`});
        return;
    }
    // let employeeID = employeeDB.length>=1 ? employeeDB[employeeDB.length-1].id+1 : 1;
    const newEmployee = new EmployeesModel({
        name: req.body.name,
        email: req.body.email,
        department: req.body.department,
        salary: req.body.salary,
    });
    newEmployee.save()
    .then(empObj=>{res.status(200).json(empObj)})
    .catch(err=>{res.status(406).json({"Message":`Error Occured : ${err}`})});
};


const updateEmployee = (req, res) => {
    let {name, email, salary, department} = req.body;
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
        if(!employee) throw new Error("Email id doesn't exists.");
        employee.name = name || employee.name;
        employee.salary = salary || employee.salary;
        employee.department = department || employee.department;
        employee.save()
        .then(employee=>{res.status(202).json(employee);})
        .catch(err=>res.status(500).json({"Message":`Error occured while updating employee's details, Error : ${err}.`}));
    })
    .catch(err=>{
        res.status(400).json({"Message":`Error Occured while searching for the employee. ${err}.`});
    })
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
            res.status(501).json({"Message":`Not able to delete/find employee with email ${filter.email}.`});
            return;
        }
        res.status(200).json({"Message":`Employee with email ${filter.email} is deleted.`})
    })
    .catch(err=>{
        res.status(500).json({"Message":`Error Occured while searching for the employee. ${err}.`});
    })
};


module.exports = {
    getEmployee,
    getAllEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee
};
