// const mysql=require('mysql');
// require('dotenv').config();

// const db=mysql.createConnection({
//     host:process.env.DB_HOST,
//     user:process.env.DB_USER,
//     password:process.env.DB_PASSWORD,
//     database:process.env.DB_NAME
// });



// db.connect((err)=>{
//     if(err){
//         console.error("Error connecting to database",err.stack);
//         return;
//     }
//     console.log('Connected to MySQL as id ' + db.threadId);
// });
// module.exports=db;



const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool with enhanced stability settings
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 20000 // Increase timeout to prevent protocol failures during slow connections
});

// Proactive Connection Check
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Database Link Established and Verified.');
        connection.release();
    } catch (err) {
        console.error('❌ Database Connection Failed!', {
            message: err.message,
            code: err.code,
            fatal: err.fatal
        });
        
        if (err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
            console.error('💡 TIP: Your MySQL user might need the "mysql_native_password" plugin. Try running:');
            console.error(`   ALTER USER '${process.env.DB_USER}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${process.env.DB_PASSWORD}';`);
        }
    }
})();

module.exports = db;


