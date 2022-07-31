const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'zPdZ8lFPF!75',
        database: 'employees'
    },

    console.log('Connecting to the employees database...')
)

module.exports = db;