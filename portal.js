const mysql     = require('mysql2/promise');
const inquirer  = require('inquirer');
const cTable    = require('console.table');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: "password",
    database: 'employee_management',
    connectionLimit: 10,
    queueLimit: 0
});

async function getAllDepartment(){
    await pool.execute(
        'SELECT d.id AS DepartmentID, d.name AS DepartmentName \
        FROM department as d',
        function(err, results, fields){
            console.table(results);
            cli();
        }
    )
}

async function getAllRole(){
    await pool.execute(
        'SELECT \
        r.id AS RoleID, r.title AS Title, d.name as Department, r.salary AS Pay \
        FROM role AS r\
        INNER JOIN department AS d ON r.department_id = d.id',
        function(err, results, fields){
            console.table(results);
            cli();
        },
    )
}

async function getAllEmployee(){
    await pool.execute(
        'SELECT \
        e.id AS EmployeeID, e.first_name AS FirstName, e.last_name AS LastName, \
        r.title AS Title, d.name AS Department, r.salary AS Pay, \
        CONCAT(m.first_name, \' \', m.last_name) AS Manager \
        FROM employee AS e \
        INNER JOIN employee AS m ON m.id = e.manager_id \
        INNER JOIN role AS r ON e.role_id = r.id \
        INNER JOIN department AS d ON r.department_id = d.id \
        ',
        function(err, results, fields){
            console.table(results);
            cli();
        }
    )
}

/*
Command Line Interface using Inquirer
*/
function cli(){
    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "===Company Org Chart Menu===",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a new Department",
        "Add a new Role",
        "Add a new Employee",
        "Update Employee Role",
        "Exit"
      ]
    })
  .then(function(answer) {
        if (answer.action === 'View all Departments') {
            getAllDepartment();
        } else if (answer.action === 'View all Roles') {
            getAllRole();
        } else if (answer.action === 'View all Employees') {
            getAllEmployee();
        } else if (answer.action === 'Add a department') {
            addNewDepartment();
        } else if (answer.action === 'Add a role') {
            //addNewRole();
        } else if (answer.action === 'Add an employee') {
            //addNewEmployee();
        } else if (answer.action === 'Update employee role') {
            //updateRole();
        } else if (answer.action === 'Exit') {
            pool.end();
        }
  })
}

cli();