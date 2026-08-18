import db from "../config/db.js";

// ===============================
// PERFORMANCE REPORT
// ===============================

export async function getPerformanceReport() {
  const [rows] = await db.query(`
    SELECT
      e.employees_id AS employee_id,
      CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
      e.position,
      e.contact,
      d.department_name AS department,
      p.performance_score,
      p.goal_completion
    FROM performance p
    INNER JOIN employees e
      ON p.employees_id = e.employees_id
    INNER JOIN departments d
      ON e.department_id = d.department_id
    ORDER BY e.employees_id
  `);

  return rows;
}


// ===============================
// ATTENDANCE REPORT
// ===============================

export async function getAttendanceReport() {
  const [rows] = await db.query(`
    SELECT
      e.employees_id AS employee_id,
      CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
      e.position,
      e.contact,
      d.department_name AS department,
      a.attendance_date,
      a.status
    FROM attendance a
    INNER JOIN employees e
      ON a.employee_id = e.employees_id
    INNER JOIN departments d
      ON e.department_id = d.department_id
    ORDER BY a.attendance_date DESC
  `);

  return rows;
}


// ===============================
// PAYROLL REPORT
// ===============================

export async function getPayrollReport() {
  const [rows] = await db.query(`
    SELECT
      e.employees_id AS employee_id,
      CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
      e.position,
      e.contact,
      d.department_name AS department,
      p.hours_worked,
      p.leave_deductions,
      p.final_salary
    FROM payroll p
    INNER JOIN employees e
      ON p.employees_id = e.employees_id
    INNER JOIN departments d
      ON e.department_id = d.department_id
    ORDER BY e.employees_id
  `);

  return rows;
}


// ===============================
// PENDING LEAVE
// ===============================

export async function getPendingLeaveCount() {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS pending_leave
    FROM leave_request
    WHERE status = 'Pending'
  `);

  return rows[0].pending_leave;
}