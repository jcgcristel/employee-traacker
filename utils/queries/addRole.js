const inquirer = require("inquirer");
const db = require('../../db/connection');
const { getId, getColumn } = require('./_queries');
const { line } = require('../utils');

// Questions to add a role
const addRoleQuestions = function(departments) {
    return [
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
            choices: departments,
            message: 'Department:'
        }
    ]
};

// Add role to roles table
const addRoleSql = function(title, salary, departmentId) {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
    const params = [title, salary, departmentId];
    db.query(sql, params, e => {
        if (e) throw e;
    })
};

const addRole = function(back) {
    // Get list of department names
    getColumn('name', 'departments')
        .then(results => {
            line();
            // Start inquirer to create a new department
            inquirer.prompt(addRoleQuestions(results))
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
                            console.log(`\nAdded new role by name ${answer.title}.\n`);
                            back();
                        });
                });
        });
};

module.exports = addRole;