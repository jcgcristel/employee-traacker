const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'P9A4$1!mGi@A', // desktop
        // password: 'zPdZ8lFPF!75', // laptop
        database: 'employees'
    },

    console.log('Connecting to the employees database...')
)

module.exports = db;