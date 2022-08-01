const inquirer = require("inquirer");
const { exit } = require("process");
const { clear } = require('./utils');

// Queries
const { view } = require('./queries/_queries');
const addDepartment = require('./queries/addDepartment');
const addEmployee = require('./queries/addEmployee');
const addRole = require('./queries/addRole');

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

const menuChoices = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    `Update an employee's role`,
    'QUIT'
];

const main = function() {
    clear();
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        choices: menuChoices,
        message: 'ACTION:'
    }])
        .then((choice) => {
            switch (choice.action) {
                case 'View all departments':
                    view('departments', backToMain);
                    break;
                case 'View all roles':
                    view('roles', backToMain);
                    break;
                case 'View all employees':
                    view('employees', backToMain);
                    break;
                case 'Add a department':
                    addDepartment(backToMain);
                    break;
                case 'Add a role':
                    addRole(backToMain);
                    break;
                case 'Add an employee':
                    addEmployee(backToMain);
                    break;
                case `Update an employee's role`:
                    updateEmployeeRole(backToMain);
                    break;
                case 'QUIT':
                    exit();
                default:
                    console.log('Unhandled choice.');
                    exit();
            };
        });
};

module.exports = { main, backToMain};

