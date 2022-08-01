const inquirer = require("inquirer");
const { exit } = require("process");
const db = require('../db/connection');

// Queries
const { view } = require('./queries/_queries');
const addDepartment = require('./queries/addDepartment');
const addEmployee = require('./queries/addEmployee');
const addRole = require('./queries/addRole');

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
};

const clear = function() {    
    console.clear()
    title();
};

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
                    view('departments');
                    backToMain();
                    break;
                case 'View all roles':
                    view('roles');
                    backToMain();
                    break;
                case 'View all employees':
                    view('employees');
                    backToMain();
                    break;
                case 'Add a department':
                    addDepartment();
                    backToMain();
                    break;
                case 'Add a role':
                    addRole();
                    backToMain();
                    break;
                case 'Add an employee':
                    addEmployee();
                    backToMain();
                    break;
                case `Update an employee's role`:
                    updateEmployeeRole();
                    backToMain();
                    break;
                case 'QUIT':
                    exit();
                default:
                    console.log('Unhandled choice.');
                    exit();
            };
        });
};

module.exports = main;

