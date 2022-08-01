const inquirer = require("inquirer");
const db = require('../db/connection');
const { getId, getColumn } = require('./_queries');

// Add department
const addDepartment = function() {
    console.log('--------------------------------------------------');
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Department name:'
    }])
        .then((answer) => {
            const sql = `INSERT INTO departments (name) VALUES (?)`;
            const params = [answer.name];
            
            db.query(sql, params, (e) => {
                if (e) throw e;                
                console.log(`\nCreated department named '${answer.name}'\n`);
            })
        })
}

module.exports = addDepartment;