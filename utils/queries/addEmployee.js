const inquirer = require("inquirer");
const db = require('../db/connection');
const { getId, getColumn } = require('./_queries');

// Questions to add an employee
const addEmployeeQuestions = [
    {
        type: 'input',
        name: 'first_name',
        message: 'First Name:'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'Last Name:'
    },
    {
        type: 'input',
        name: 'id',
        message: 'ID Number:'
    },
    {
        type: 'list',
        name: 'role',
        choices: rolesArray,
        message: 'Role:'
    },
    {
        type: 'list',
        name: 'manager',
        choices: employeesArray,
        message: 'Manager:'
    }
];

// Set full name to be called during employee creation
const setFullNameSql = function(firstName, lastName) {
    const sql = `UPDATE employees SET full_name = CONCAT(?, ' ', ?) WHERE first_name = ? AND last_name = ?`;
    const params = [firstName, lastName, firstName, lastName];
    db.query(sql, params, e => {
        if (e) throw e;
    })
};

// Add into employee table
const addEmployeeSql = function(firstName, lastName, id, roleId, managerId) {
    const sql = `INSERT INTO employees (first_name, last_name, id, role_id, manager_id) VALUES (?, ?, ?, ? , ?)`;
    const params = [firstName, lastName, id, roleId, managerId];
    db.query(sql, params, e => {
        if (e) throw e;
        setFullNameSql(firstName, lastName);
    });
};

const addEmployee = function() {
    console.log('--------------------------------------------------');
    // Get list of role names
    let getRoles = getColumn('title', 'roles');
    // Get employee name
    let getEmployees = getColumn('full_name', 'employees');
    
    // Promise handler to get names of roles and employees
    Promise.all([getRoles, getEmployees])
        .then(results => {
            // Get roles list
            let rolesArray = results[0];
            // Get employees list
            let employeesArray = results[1];

            // Adds null options
            rolesArray.push('NONE');
            employeesArray.push('NONE');
            
            // Start inquirer to create a new employee
            line();
            inquirer.prompt()
            .then((answer) => {
                // Gets id of selected role
                let getRoleId = getId('roles', 'title', answer.role);                
                // Get id of selected employee
                let getEmployeeId = getId('employees', 'full_name', answer.manager);
                
                // Promise handler to get ids of roles and employees
                Promise.all([answer, getRoleId, getEmployeeId])
                    .then(results => {
                        // Parse answer from previous function
                        let answer = results[0];
                        // Adds employee to employees table
                        addEmployeeSql(answer.first_name, answer.last_name, answer.id, results[1], results[2]);
                        console.log(`\nAdded new employee named ${answer.first_name} ${answer.last_name}.\n`)
                    });
            });
        });
};

module.exports = addEmployee;