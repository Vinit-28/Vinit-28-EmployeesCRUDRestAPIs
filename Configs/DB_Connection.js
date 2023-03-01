const mongoose = require('mongoose');


// Setting the configs //
mongoose.set('strict', true); // This will prevent doing modification with schema at the run time //
mongoose.set('strictQuery', false); // This is for query filters //


const getDBConnectionObject = (db_name)=>{
    const dbConnection = mongoose.createConnection(process.env.DB_SERVER_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            family: 4
        }
    )
    .useDb(db_name);
    return dbConnection;
}


// Exporting //
module.exports = {getDBConnectionObject};