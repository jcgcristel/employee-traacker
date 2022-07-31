INSERT INTO department (name) VALUES
    ('Shogunate'),
    ('Tenryou Commission'),
    ('Kanjou Commission'),
    ('Yashiro Commission');

INSERT INTO employee_role (title, salary, department_id) VALUES
    ('Raiden Shogun', 250000, 1),
    ('Tenryou Commisioner', 150000, 2),
    ('Kanjou Commissioner', 150000, 3),
    ('Yashiro Commissioner', 150000, 4);

INSERT INTO employee (id, first_name, last_name, employee_role_id, manager_id) VALUES
    (1000, 'Makoto', 'Raiden', 1),
    (1001, 'Ei', 'Raiden', 1),
    (2000, 'Kamaji', 'Kujou', 2),
    (2708, 'Sara', 'Kujou'),
    (3000, 'Chisato', 'Hiiragi', 3),
    (4000, 'Ayato', 'Kamisato', 4)
    (4001, 'Ayaka', 'Kamisato');