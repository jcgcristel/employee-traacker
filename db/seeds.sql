INSERT INTO departments (name) VALUES
    ('Shogunate'),
    ('Tenryou Commission'),
    ('Kanjou Commission'),
    ('Yashiro Commission');

INSERT INTO roles (title, salary, department_id) VALUES
    ('Raiden Shogun', 250000, 1),
    ('Tenryou Commisioner', 150000, 2),
    ('Kanjou Commissioner', 150000, 3),
    ('Yashiro Commissioner', 150000, 4);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES
    (1000, 'Makoto', 'Raiden', 1, NULL),
    (1001, 'Ei', 'Raiden', 1, NULL),
    (2000, 'Kamaji', 'Kujou', 2, 1001),
    (2708, 'Sara', 'Kujou', NULL, 2000),
    (3000, 'Chisato', 'Hiiragi', 3, 1001),
    (4000, 'Ayato', 'Kamisato', 4, 1001),
    (4001, 'Ayaka', 'Kamisato', NULL, 4000);