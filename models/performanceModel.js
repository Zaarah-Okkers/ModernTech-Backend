import pool from "../config/db.js";

export async function getAllPerformance() {
  const [rows] = await pool.query(`
    SELECT
      performance.performance_id,
      employees.employees_id AS employee_id,
      CONCAT(
        employees.first_name,
        ' ',
        employees.last_name
      ) AS name,
      employees.position,
      departments.department_name AS department,
      performance.performance_score,
      performance.goal_completion
    FROM performance
    INNER JOIN employees
      ON performance.employees_id = employees.employees_id
    INNER JOIN departments
      ON employees.department_id = departments.department_id
    ORDER BY employees.employees_id
  `);

  return rows;
}

export async function getPerformanceByEmployees(employeesId) {
  const [rows] = await pool.query(`
    SELECT
      performance.performance_id,
      employees.employees_id AS employee_id,
      CONCAT(
        employees.first_name,
        ' ',
        employees.last_name
      ) AS name,
      employees.position,
      departments.department_name AS department,
      performance.performance_score,
      performance.goal_completion
    FROM performance
    INNER JOIN employees
      ON performance.employees_id = employees.employees_id
    INNER JOIN departments
      ON employees.department_id = departments.department_id
    WHERE employees.employees_id = ?
  `, [employeesId]);

  return rows;
}