const inquirer = require("inquirer");
const ctable = require('console.table');
const { exit } = require("process");
const db = require('../db/connection');

const line = function() {
    return console.log('--------------------------------------------------');
};

const title = function() {
    return console.log(`--------------------------------------------------
     _____                 _                       
    | ____|_ __ ___  _ __ | | ___  _   _  ___  ___ 
    |  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\
    | |___| | | | | | |_) | | (_) | |_| |  __|  __/
    |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|
    ______         |_|            |___/                 
    |_   __|__ __ _  ___| | _____ _ __ 
      | || '__/ _\` |/ __| |/ / _ | '__|
      | || | | (_| | (__|   |  __| |   
      |_||_|  \\__,_|\\___|_|\\_\\___|_|
--------------------------------------------------`);
}

const menu = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    `Update an employee's role`,
    'QUIT'
];

const clear = function() {    
   console.clear()
   title();
}

const backToMain = function() {
    inquirer.prompt([{
        type: 'confirm',
        name: 'back',
        default: true,
        message: `Return to menu:`
    }])
        .then((answer) => {
            
            if (answer.back === true) {
                main();
            } else { exit(); }
        });
};

const main = function() {
    clear();
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        choices: menu,
        message: 'ACTION:'
    }])
        .then((choice) => {
            switch (choice.action) {
                case 'View all departments':
                    view('departments');
                    break;
                case 'View all roles':
                    view('roles');
                    break;
                case 'View all employees':
                    view('employees');
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case `Update an employee's role`:
                    updateEmployeeRole();
                    break;
                case 'QUIT':
                    exit();
                default:
                    console.log('Choice not configured');
                    exit();
            };
        });
};

// Display table results
const view = function(table) {
    line();
    const sql = `SELECT * FROM ${table}`;
    db.query(sql, (e, res) => {
        if (e) throw e;
        console.table(res);
        backToMain();
    })
};

// get id of a row of a table given a conditional statement
const getId = function(table, conditionName, conditionValue) {
    const sql = `SELECT id FROM ?? WHERE ?? = ? LIMIT 1`;
    const params = [table, conditionName, conditionValue];
    return new Promise((resolve, reject) => {
        db.query(sql, params, (e, res) => {
            if (e) throw e;
            // Handler if ID doesn't exist
            if (!res.length)
            {
                resolve(null);
            } else {
                // get id given a row
                resolve(res[0].id);
            }            
        });      
    });
};

// Get column of a table given its name
const getColumn = function(colummn, table) {
    const sql = `SELECT ?? FROM ??`;
    const params = [colummn, table];

    return new Promise((resolve, reject) => {
        db.query(sql, params, (e, res) => {
            if (e) throw e;
            // Array to hold values of column
            let columnArray = [];
            // Adds values from column to array
            res.map(data => columnArray.push(Object.values(data)[0]));
            resolve(columnArray);
        })
    });
};

// Add department
const addDepartment = function() {
    line();
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
                backToMain();
            })
        })
}

// Insert into roles tables

// Add role to roles table
const addRoleSql = function(title, salary, departmentId) {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
    const params = [title, salary, departmentId];
    db.query(sql, params, e => {
        if (e) throw e;
    })
};

const addRole = function() {
    // Get list of department names
    getColumn('name', 'departments')
        .then(results => {
            line();
            // Start inquirer to create a new department
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Title:'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Salary:'
                },
                {
                    type: 'list',
                    name: 'department',
                    choices: results,
                    message: 'Department:'
                }
            ])
                .then(answer => {
                    // Gets id of selected department
                    let getDepartmentId = getId('departments', 'name', answer.department);

                    // Promise handlder to get department id
                    Promise.all([answer, getDepartmentId])
                        .then(results => {
                            // Parse answer from previous function
                            let answer = results[0];
                            // Adds role to roles table
                            addRoleSql(answer.title, answer.salary, results[1]);
                            console.log(`\nAdded new role by name ${title}.\n`);
                            backToMain();
                        });
                });
        });
};

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
            inquirer.prompt([
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
            ])
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
                        backToMain();
                    });
            });
        });
};


// Update employee's role (and their department as a result)
const updateEmployeeRoleSql = function(employeeId, roleId) {
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
    const params = [roleId, employeeId];
    console.log(db.query(sql, params, e => {
        if (e) throw e;
    }));
}

const updateEmployeeRole = function() {
    // Get list of employee names
    let getEmployees = getColumn('full_name', 'employees');
    // Get list of roles names
    let getRoles = getColumn('title','roles');

    // Promise handler to get names of eemployees and departments
    Promise.all([getEmployees, getRoles])
        .then(results => {
            line();
            // Start inquirer to update role
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'name',
                    choices: results[0],
                    message: 'Choose an employee to edit:'
                },
                {
                    type: 'list',
                    name: 'role',
                    choices: results[1],
                    message: 'Role of selected employee:'
                }
            ])
                .then(answer => {
                    // Get id of selected employee
                    let getEmployeeId = getId('employees', 'full_name', answer.name);
                    // Get if of selected role
                    let getRoleId = getId('roles', 'title', answer.role);
                    
                    // Promise handler to get id of employee and role
                    Promise.all([answer, getEmployeeId, getRoleId])
                        .then(results => {
                            //parse answer from previous function
                            let answer = results[0];
                            // Updates employee's role
                            console.log(results);
                            updateEmployeeRoleSql(results[1], results[2]);
                            console.log(`\nUpdated ${answer.name}'s role to ${answer.role}.\n`);
                            backToMain();
                        })
                })        
        });

    //
};

module.exports = main;

