# Employee Tracker

## Description
A tracker to let you manage employees in an organization

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Question](#questions)

## Installation

You are required to have MySQL installed.

### Required Packages
Ensure the following are installed using node.js:

Inquirer

    npm i inquirer@8.2.4

MySQL

    npm i mysql2

Console.Tables

    npm i console.table --save

### Database Requirements
Ensure your database and tables are structure properly using the .sql files in the **./db** directory and is accessible using:

    MySQL -u root -p

If a password has been set, you will be prompted for a password to the SQL Database.

Using MySQL, run the following commands in the ./db directory:

    source db.sql
    source schema.sql

(Optional) For an example organization, run:

    source seeds.sql

## Usage
A console application that lets you view departments, roles, and employees of an organization. You can also add new departments, roles, and employees where employees are can be assigned a role, and in turn, assigned to a department. Employee roles can also be updated in cases where a transfer or mistake has occured.

### Application Screenshot
![App Preview](\images\site-prev.png)

### Demo
https://youtu.be/p6_v6L83KeM 

## Future Development
- Update employee managers
- View employees by manager
- View employees by department
- Delete departments, roles, and employees
- View the tottal utilized budget of a department (combined salaries of all employees in a department)

## Questions
[jcgcristel's GitHub](https://github.com/jcgcristel)

For additional questions, you can email me at [jcg.cristel@gmail.com](mailto:jcg.cristel@gmail.com.).
