const mysql=require('mysql');
require('dotenv').config();

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'parcel_tracking'
});

db.connect((err)=>{
    if(err){
        console.error("Error connecting to database",err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + db.threadId);
});
module.exports=db;

