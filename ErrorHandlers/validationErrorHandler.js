

const modelsErrorHandler = (errObj, res) => {
    let errMsgs = [], statusCode = 400;
    if( errObj.code ){
        let key = Object.keys(errObj.keyValue)[0];
        errMsgs.push(`${key} is already registered.`);
    }
    else if( (errObj.errors instanceof Object) && Object.values(errObj.errors).length ){
        for(let err of Object.values(errObj.errors)){
            let errMssg = (err.properties && err.properties.message )? err.properties.message : (err.message)? err.message : undefined;
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
    modelsErrorHandler
};