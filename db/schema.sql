DROP TABLE IF EXISTS employee_role
DROP TABLE IF EXISTS employee
DROP TABLE IF EXISTS department

CREATE TABLE department (
    id INTEGER PRIMARY KEY,
    name VARCHAR(30)
)

CREATE TABLE employee_role (
    id PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    CONSTRAINT fk_department FOREIGN KE (department) REFERENCES department(id) ON DELETE SET NULL
)

CREATE TABLE employee (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    CONSTRAINT fk_employee_role FOREIGN KEY employee_role(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee FOREIGN KEY employee(id) ON DELETE SET NULL
)