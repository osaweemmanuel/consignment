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
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

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

// Proactive Connection Check & Schema Initialization
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Database Link Established and Verified.');
        
        // Auto-Initialize All Infrastructure Tables
        const tables = [
            `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                gender VARCHAR(50) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

            `CREATE TABLE IF NOT EXISTS parcels (
                id INT AUTO_INCREMENT PRIMARY KEY,
                trackingNumber VARCHAR(100) UNIQUE NOT NULL,
                userId INT,
                senderName VARCHAR(255),
                senderPhone VARCHAR(50),
                senderNationality VARCHAR(100),
                senderGender VARCHAR(50),
                senderEmail VARCHAR(255),
                receiverName VARCHAR(255),
                receiverPhone VARCHAR(50),
                receiverEmail VARCHAR(255),
                receiverNationality VARCHAR(100),
                receiverGender VARCHAR(50),
                origin VARCHAR(255),
                weight VARCHAR(50),
                destination VARCHAR(255),
                originLatitude DECIMAL(10, 8) DEFAULT 0,
                originLongitude DECIMAL(11, 8) DEFAULT 0,
                currentLatitude DECIMAL(10, 8) DEFAULT 0,
                currentLongitude DECIMAL(11, 8) DEFAULT 0,
                destinationLatitude DECIMAL(10, 8),
                destinationLongitude DECIMAL(11, 8),
                service_type VARCHAR(100),
                description TEXT,
                parcelName VARCHAR(255),
                dispatchDate VARCHAR(100),
                deliveryDate VARCHAR(100),
                imageUrl VARCHAR(255),
                imagePublicId VARCHAR(255),
                freight_charge DECIMAL(10, 2) DEFAULT 0,
                insurance_fee DECIMAL(10, 2) DEFAULT 0,
                tax_due DECIMAL(10, 2) DEFAULT 0,
                currentLocation VARCHAR(255) DEFAULT 'Inducted at Logistics Terminal',
                status VARCHAR(100) DEFAULT 'In Transit',
                progressStatus INT DEFAULT 0,
                payment_status VARCHAR(50) DEFAULT 'Pending',
                hold_reason TEXT,
                release_fee DECIMAL(10, 2) DEFAULT 0,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

            `CREATE TABLE IF NOT EXISTS parcel_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                parcel_id INT,
                trackingNumber VARCHAR(100),
                currentLocation VARCHAR(255),
                destinationLongitude DECIMAL(11, 8),
                destinationLatitude DECIMAL(10, 8),
                progressStatus INT,
                status VARCHAR(100),
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

            `CREATE TABLE IF NOT EXISTS receipts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullName VARCHAR(255),
                email VARCHAR(255),
                referenceId VARCHAR(100),
                userId INT,
                payment_description TEXT,
                payment_method VARCHAR(100),
                amount DECIMAL(15, 2),
                total_payment DECIMAL(15, 2),
                payment_date DATETIME,
                currency VARCHAR(10) DEFAULT 'USD',
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

            `CREATE TABLE IF NOT EXISTS activity_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT,
                action VARCHAR(255),
                details TEXT,
                ip_address VARCHAR(100) DEFAULT 'Internal',
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

            `CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                inquiryType VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
            `CREATE TABLE IF NOT EXISTS parcel_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                parcel_id INT NOT NULL,
                imageUrl VARCHAR(255) NOT NULL,
                imagePublicId VARCHAR(255) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
        ];
        
        for (const sql of tables) {
            await connection.query(sql);
        }

        // Migration: Ensure senderEmail is present even if table already exists
        await connection.query(`ALTER TABLE parcels ADD COLUMN IF NOT EXISTS senderEmail VARCHAR(255)`);
        
        console.log('📦 Global Database Schema Manifested (All Modules Active).');
        
        // Ensure the Master Admin Identity is active and synchronized
        const adminPass = '$2a$10$Z1UbdCF.fa9lR323IcJgz.es22.E1GOVD0QYdQUj9C59reydAGxdG'; // Hash for 'AdminPassword123!'
        const [existingAdmin] = await connection.query("SELECT id FROM users WHERE email = ?", ['admin@tunshpresh.com']);
        
        if (existingAdmin.length === 0) {
            await connection.query(
                "INSERT INTO users (firstname, lastname, gender, email, password) VALUES (?, ?, ?, ?, ?)",
                ['Admin', 'User', 'Male', 'admin@tunshpresh.com', adminPass]
            );
            console.log('👤 Primary Admin Identity Created: admin@tunshpresh.com / AdminPassword123!');
        } else {
            await connection.query(
                "UPDATE users SET password = ? WHERE email = ?",
                [adminPass, 'admin@tunshpresh.com']
            );
            console.log('🔄 Admin Identity Credentials Synchronized.');
        }

        connection.release();
    } catch (err) {
        console.error('❌ Database Configuration Fault:', {
            message: err.message,
            code: err.code
        });
        
        if (err.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
            console.error('💡 TIP: Use mysql_native_password for the "root" user.');
        }
    }
})();

module.exports = db;


