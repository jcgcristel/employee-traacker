const inquirer = require("inquirer");
const cTable = require('console.table');
const { exit } = require("process");
const { post } = require("../routes/apiRoutes");
// const fetch = require()

const URL = 'http://localhost:3001/api';

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
                case 'Add a role:':
                    break;
                case 'Add an employee':
                    break;
                case 'Update an employee role':
                    break;
                default:
                    exit();
            };
        });
};


// GET request to view table as stated in the parameter
const view = function(table) {
    line();
    fetch(`${URL}/${table}`)
        .then((response) => response.json())
        .then((data) => console.table(Object.values(data)[0]))
        .then(backToMain);
}

// POST request add a department
const addDepartment = function() {
    line();
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Department name:'
    }])
        .then((name) => {
            console.log(`Created department name of '${name}'`);

            // post(`${URL}/department`, {
            //     body: name
            // });

        })
        .then(backToMain);    
}

module.exports = main;

