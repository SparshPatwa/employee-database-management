USE employee_management;

INSERT INTO department (name) VALUES ("Executive");
INSERT INTO department (name) VALUES ("Sales");
INSERT INTO department (name) VALUES ("Accounting");

INSERT INTO role (title, salary, department_id) VALUES ("CEO", 250000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Regional Manager", 200000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Sales Lead", 180000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Salesman", 150000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Accounting Lead", 100000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Accountant", 100000, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("David", "Wallace", 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Michael", "Scott", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dwight", "Schrute", 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jim", "Halpert", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Angela", "Martin", 5, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kevin", "Mahlone", 6, 4);