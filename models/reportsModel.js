import db from "../config/db.js";

export const getReports = async () => {
  const [rows] = await db.query(`
    SELECT
      e.employees_id AS employee_id,
      CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
      e.position,
      e.contact,
      d.department_name AS department,

      p.performance_score,
      p.goal_completion,

      pr.hours_worked,
      pr.leave_deductions,
      pr.final_salary,

      COUNT(DISTINCT CASE
        WHEN a.status = 'Present'
        THEN a.attendance_id
      END) AS days_present,

      COUNT(DISTINCT CASE
        WHEN a.status = 'Absent'
        THEN a.attendance_id
      END) AS days_absent,

      COUNT(DISTINCT CASE
        WHEN lr.status = 'Pending'
        THEN lr.leave_id
      END) AS pending_leave

    FROM employees e

    LEFT JOIN departments d
      ON e.department_id = d.department_id

    LEFT JOIN performance p
      ON e.employees_id = p.employees_id

    LEFT JOIN payroll pr
      ON e.employees_id = pr.employees_id

    LEFT JOIN attendance a
      ON e.employees_id = a.employee_id

    LEFT JOIN leave_request lr
      ON e.employees_id = lr.employees_id

    GROUP BY
      e.employees_id,
      e.first_name,
      e.last_name,
      e.position,
      e.contact,
      d.department_name,
      p.performance_score,
      p.goal_completion,
      pr.hours_worked,
      pr.leave_deductions,
      pr.final_salary

    ORDER BY e.employees_id;
  `);

  return rows;
};