const inquirer = require("inquirer");
const db = require('../db/connection');
const { getId, getColumn } = require('./_queries');

// Update employee's role (and their department as a result)
const updateEmployeeRoleSql = function(employeeId, roleId) {
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
    const params = [roleId, employeeId];
    console.log(db.query(sql, params, e => {
        if (e) throw e;
    }));
}

const updateEmployeeRole = function() {
    console.log('--------------------------------------------------');
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
                        })
                });     
        });
};

module.exports = updateEmployeeRole;