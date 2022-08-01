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
    'Update an employee role',
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
                    break;
                case 'Update an employee role':
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
                        console.log(`\nCreated a new role named '${answer.title}\n'`);
                        backToMain();
                    })



                })

                const sql = `INSERT INTO (title, salary, department_id)`
            });
    });
}

// Add employee
const addEmployee = function() {
    // Select statement to get list of role names
    const sqlRoleName = `SELECT name FROM roles`;
    db.query(sqlRoleName, (e, roleName) => {
        if (e) throw e;
    })
}

module.exports = main;

