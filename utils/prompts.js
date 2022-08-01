const inquirer = require("inquirer");
const cTable = require('console.table');
const { exit } = require("process");
// const fetch = require()

const line = function() {
    return console.log('--------------------------------------------------');
};

const navOptions = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    'Update an employee role',
    'Quit'
];

const backToMain = function() {
    inquirer.prompt([{
        message: `Back to Main Menu:`,
        name: 'back',
        type: 'confirm',
        default: true
    }])
    .then((answer) => {
        line();
        if (answer.back === true) { mainNav() }
        else { exit() }
    });
};

const main = function() {
    line();
    console.log(`_____                 _                       
| ____|_ __ ___  _ __ | | ___  _   _  ___  ___ 
|  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\
| |___| | | | | | |_) | | (_) | |_| |  __|  __/
|_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|
______         |_|            |___/                 
|_   __|__ __ _  ___| | _____ _ __ 
| || '__/ _\` |/ __| |/ / _ | '__|
| || | | (_| | (__|   |  __| |   
|_||_|  \\__,_|\\___|_|\\_\\___|_|`);
    line()
    mainNav();    
};

const mainNav = function() {
    inquirer.prompt([{
        message: 'HOME NAVIGATION:',
        name: 'mainNav',
        type: 'list',
        choices: navOptions
    }])
    .then((answer) => {
        switch (answer.mainNav) {
            case 'View all departments':
                viewDepartments();
                break;
            default:
                exit();
        };
    });
};

const viewDepartments = function() {
    line();
    fetch('http://localhost:3001/api/departments')
        .then((response) => response.json())
        .then((data) => console.table(data.departments))
        .then(backToMain);
};

module.exports = main;

