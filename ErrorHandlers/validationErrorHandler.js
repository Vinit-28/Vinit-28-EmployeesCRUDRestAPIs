

const employeeModelErrorHandler = (errObj, res) => {
    let errMsgs = [], statusCode = 400;
    if( errObj.code ){
        errMsgs.push('Email Id is already registered.');
    }
    else if( (errObj.errors instanceof Object) && Object.values(errObj.errors).length ){
        for(let err of Object.values(errObj.errors)){
            let errMssg = (err.properties && err.properties.message )? err.properties.message : (err.reason)? err.message : undefined;
            errMsgs.push(errMssg);
        }
    }
    else if( errObj.isCustomError === true ){
        errMsgs.push(errObj.message);
    }
    else{
        errMsgs.push(`Some Internal Server Error.\n${errObj.message}`);
        statusCode = 500;
    }
    res.status(statusCode).json({"Errors":errMsgs});
};


module.exports = {
    employeeModelErrorHandler
};