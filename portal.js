/*
Packages
*/
const mysql     = require('mysql2/promise');
const inquirer  = require('inquirer');
const cTable    = require('console.table');
const { callbackify } = require('util');
/*
SQL connection pool
*/
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: "password",
    database: 'employee_management',
    connectionLimit: 10,
    queueLimit: 0
});
/*
SQL routines using prepared mysql2 functionality
*/
async function getAllDepartment(){
    await pool.execute(
        'SELECT d.id AS DepartmentID, d.name AS DepartmentName \
        FROM department as d \
        ORDER BY d.id \
        ',
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
        INNER JOIN department AS d ON r.department_id = d.id \
        ORDER BY r.id \
        ',
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
        ORDER BY e.id \
        ',
        function(err, results, fields){
            console.table(results);
            cli();
        }
    )
}

async function insertNewDepartment(newDepartment) {
    await pool.execute(
        'INSERT INTO department (name) \
        VALUES (?)',
        [ newDepartment ]
    )
}

async function setNewRole(answer) {
    const newTitle = answer.title;
    const newSalary = answer.salary;
    const departmentName = answer.department_name;
    query = "SELECT d.id FROM department AS d WHERE d.name = \'"+departmentName+"\'";
    await pool.execute(
        //TODO: Get placeholder working
        /*
        'SELECT \
        d.id \
        FROM department AS d \
        WHERE d.name = \'HR\' \
        ',
        [department_name ],
        */
        query,
        function(err, results) {
            insertNewRole(newTitle, newSalary, results[0].id);
            cli();
        }
    );
}

async function insertNewRole(newTitle, newSalary, departmentId) {
    await pool.execute(
        'INSERT INTO role (title, salary, department_id) \
        VALUES (?, ?, ?) ',
        [ newTitle, newSalary, departmentId ]
    )
}

async function setNewEmployee(answer) {
    
    query = "SELECT r.id \
            FROM role AS r \
            WHERE r.title = \'"+answer.role+"\'";
    await pool.execute( 
        query,
        function(err, results) {
            const roleId = results[0].id;
            getManagerId(answer, roleId);
        }
    );
}

async function getManagerId(answer, roleId) {
    const firstName = answer.firstname;
    const lastName = answer.lastname;
    query = "SELECT e.id \
            FROM employee AS e \
            WHERE \
            e.first_name = \'"+answer.managerfirstname+"\' \
            AND \
            e.last_name = \'"+answer.managerlastname+"\'";
    await pool.execute( 
        query,
        function(err, results) {
            const managerId = results[0].id;
            insertNewEmployee(firstName, lastName, roleId, managerId);
            cli();
        }
    );

}

async function insertNewEmployee(firstName, lastName, roleId, managerId) {
    await pool.execute(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) \
        VALUES (?, ?, ?, ?) ',
        [ firstName, lastName, roleId, managerId ]
    )
}

async function setEmployeeRole(answer) {
    query = "SELECT r.id \
            FROM role AS r \
            WHERE r.title = \'"+answer.newrole+"\'";
    await pool.execute(
        query,
        function(err, results) {
            const roleId = results[0].id;
            getRoleId(answer, roleId);
            cli();
        }
    );
}

async function getRoleId(answer, roleId) {
    query = "SELECT e.id \
            FROM employee AS e \
            WHERE \
            e.first_name = \'"+answer.firstname+"\' \
            AND \
            e.last_name = \'"+answer.lastname+"\'";
    await pool.execute(
        query,
        function(err, results) {
            const employeeId = results[0].id;
            updateEmployeeRole(roleId, employeeId);
            cli();
        }
    );
} 

async function updateEmployeeRole(newRoleId, employeeId) {
    await pool.execute(
        'UPDATE employee as e \
        SET role_id = ? \
        WHERE e.id = ? \
        ',
        [ newRoleId, employeeId ]
    )
}

/*
CRUD functionality using Inquirer 
*/
function addDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "input",
            message: "Enter the name for the new department >",
          })
        .then(function(answer) {
            insertNewDepartment(answer.department);
            cli();
        })
}

function addRole() {
    inquirer
        .prompt([{
            name: "title",
            type: "input",
            message: "Enter title for new role >",
          },
          {
            name: "salary",
            type: "input",
            message: "Enter salary for new role >",
          },
          {
            name: "department_name",
            type: "input",
            message: "Enter department for new role >",
          }
        ])
        .then(function(answer) {
            setNewRole(answer);
        }) 
}

function addEmployee() {
    inquirer
        .prompt([{
            name: "firstname",
            type: "input",
            message: "Enter new employee's first name >",
          },
          {
            name: "lastname",
            type: "input",
            message: "Enter new employee's last name >",
          },
          {
            name: "role",
            type: "input",
            message: "Enter new employee's role >",
          },
          {
            name: "managerfirstname",
            type: "input",
            message: "Enter new employee manager's first name >",
          },
          {
            name: "managerlastname",
            type: "input",
            message: "Enter new employee manager's last name >",
          }
        ])
        .then(function(answer) {
            setNewEmployee(answer);
        }) 
}

function updateRole() {
    inquirer
        .prompt([{
            name: "firstname",
            type: "input",
            message: "Enter employee's first name >",
          },
          {
            name: "lastname",
            type: "input",
            message: "Enter employee's last name >",
          },
          {
            name: "newrole",
            type: "input",
            message: "Enter employee's new role >",
          }
        ])
        .then(function(answer) {
            setEmployeeRole(answer);
        }) 
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
        } else if (answer.action === 'Add a new Department') {
            addDepartment();
        } else if (answer.action === 'Add a new Role') {
            addRole();
        } else if (answer.action === 'Add a new Employee') {
            addEmployee();
        } else if (answer.action === 'Update Employee Role') {
            updateRole();
        } else if (answer.action === 'Exit') {
            pool.end();
        }
  })
}
// Start employeee management APP
cli();