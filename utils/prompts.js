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
}

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

// Add role
const addRole = function() {
    // Select statement to get list of department names
    const sqlDeptName = `SELECT name FROM departments`;
    db.query(sqlDeptName, (e, deptName) => {
        if (e) throw e;

        let deptArr = [];
        // makes an array of department names
        deptName.map(val => deptArr.push(val.name));

        // Start inquiry to create a new role
        line();
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
                choices: deptArr,
                message: 'Department:'
            }
        ])
            .then((answer) => {
                // Find dept id of selected department
                const sqlDeptId = `SELECT id FROM departments WHERE name = '${answer.department}' LIMIT 1`;
                db.query(sqlDeptId, (e, deptId) => {
                    let department_id = deptId[0].id;
                    
                    // Add new role into roles table
                    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
                    const params = [answer.title, answer.salary, department_id];
                    db.query(sql, params, e => {
                        if (e) throw e;
                        console.log(`\nAdded a new role named '${answer.title}\n'`);
                        backToMain();
                    })



                })

                const sql = `INSERT INTO (title, salary, department_id)`
            });
    });
}

// get id of a row of a table given conditional statement
const getId = function(table, conditionName, conditionValue) {
    const sql = `SELECT id FROM ?? WHERE ?? = ? LIMIT 1`;
    const params = [table, conditionName, conditionValue];

    return new Promise((resolve, reject) => {
        if (true) {
            db.query(sql, params, function(e, rowId) {
                if (e) throw e;
                
                let id = rowId[0].id;
                resolve(id);
            })
        }    
    });
}

// // get values of a table given a conditional statement 
// const getRows =

// Add employee
const addEmployee = function() {
    // Select statement to get list of role names
    const sqlRoleName = `SELECT title FROM roles`;
    db.query(sqlRoleName, (e, roleTitle) => {
        if (e) throw e;

        let roleArr = ['NONE'];
        // Makes an array of role names
        roleTitle.map(val => roleArr.push(val.title));

        // Select statement to get list of employees
        const sqlEmployeeName = `SELECT first_name, last_name, id FROM employees`;
        db.query(sqlEmployeeName, (e, employeeName) => {
            if (e) throw e;

            let employeeArr = ['NONE'];
            // Makes an array of employee names
            employeeName.map(val => employeeArr.push(`${val.first_name} ${val.last_name}`));

            // Start inquiry to create a new employee
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
                    choices: roleArr,
                    message: 'Role:'
                },
                {
                    type: 'list',
                    name: 'manager',
                    choices: employeeArr,
                    message: 'Manager:'
                }
            ])
                .then((answer) => {
                    // Find role id of selected role
                    const sqlRoleId = `SELECT id FROM roles WHERE title = '${answer.role}' LIMIT 1`;
                    db.query(sqlRoleId, (e, roleId) => {
                        if (e) throw e;
                        
                        // Checks if select result of role is not null
                        let role_id;
                        if (roleId.length) {
                            role_id = roleId[0].id;
                        } else {
                            role_id = null;
                        }

                        // Parse first and last name from manager
                        let first_name = answer.manager.split( ' ')[0];
                        let last_name = answer.manager.split(' ')[1];
                        
                        // Find employee id of selected manager
                        const sqlManagerId = `SELECT id FROM employees WHERE first_name = '${first_name}' AND last_name = '${last_name}'`;
                        db.query(sqlManagerId, (e, managerId) => {
                            if (e) throw e;

                            // Checks if select result of employee is not null
                            let manager_id;
                            if (managerId.length) {
                                manager_id = managerId[0].id;
                            } else {
                                manager_id = null;
                            }

                            // Add new employee into employees table
                            const sql = `INSERT INTO employees (first_name, last_name, id, role_id, manager_id) VALUES (?, ?, ?, ? , ?)`;
                            const params = [answer.first_name, answer.last_name, answer.id, role_id, manager_id];
                            db.query(sql, params, e => {
                                if (e) throw e;
                                console.log(`\nAdded a new employee named '${answer.first_name} ${answer.last_name}'\n`);
                                backToMain();
                            });
                        });           
                    });
                });
        });
    });
};

// Update role
const updateEmployeeRole = function() {
    getId('departments', 'name', 'Yashiro Commission')
        .then(val => console.log(val));

    // // Select statement to get list of employee names
    // const sqlEmployeeName = `SELECT first_name, last_name FROM employees`;
    // db.query(sqlEmployeeName, (e, employeeName) => {
    //     if (e) throw e;

    //     // Makes an array of employee names
    //     let employeeArr = [];
    //     employeeName.map(val => employeeArr.push(`${val.first_name} ${val.last_name}`));
        
    //     // Select statement to get list of roles
    //     const sqlRoleName = `SELECT title FROM roles`;
    //     db.query(sqlRoleName, (e, roleName) => {
    //         if (e) throw e;

    //         // Makes an array of role names
    //         let roleArr = [];
    //         roleName.map(val => roleArr.push(`${val.title}`));

    //         // Start inquiry to update employee role, first prompting a list of employee role
    //         line();
    //         inquirer.prompt([
    //             {
    //                 type: 'list',
    //                 name: 'employee',
    //                 choices: employeeArr,
    //                 message: 'Choose an employee to edit:'
    //             },
    //             {
    //                 type: 'list',
    //                 name: 'role',
    //                 choices: roleArr,
    //                 message: 'Role of selected employee:'
    //             }
    //         ])
    //             .then(answer => {
    //                 // Find employee id of selected employee
                    
    //             });
    //     });
    // });
};

module.exports = main;

