import pool from '../config/database.js';

export const getAttendance = async (req, res) => {
  try {
    const [employees] = await pool.query(`
      SELECT employees_id, first_name, last_name
      FROM employees
      ORDER BY first_name, last_name
    `);

    const [records] = await pool.query(`
      SELECT attendance_id, employee_id, attendance_date, status
      FROM attendance
      ORDER BY attendance_date DESC
    `);

    const employeesWithAttendance = employees.map(emp => {
      const employeeRecords = records
        .filter(r => r.employee_id === emp.employees_id)
        .map(r => ({
          date: r.attendance_date,
          status: r.status
        }));

      return {
        employeeId: emp.employees_id,
        name: `${emp.first_name} ${emp.last_name}`,
        records: employeeRecords
      };
    });

    res.json(employeesWithAttendance);
  } catch (error) {
    console.error('Attendance API error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};
