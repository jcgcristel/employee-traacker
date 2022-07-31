DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS employee_role;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE employee_role (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    salary DECIMAL(10,2),
    department_id INTEGER,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    employee_role_id INTEGER,
    manager_id INTEGER,
    CONSTRAINT fk_employee_role FOREIGN KEY (employee_role_id) REFERENCES employee_role(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);