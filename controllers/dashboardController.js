import pool from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Query 1: Total employees
    const [employeeCount] = await pool.query('SELECT COUNT(*) as count FROM employees');
    const totalEmployees = employeeCount[0].count;

    // Query 2: Payroll processed (sum of final_salary)
    const [payrollData] = await pool.query('SELECT SUM(final_salary) as total FROM payroll');
    const payrollProcessed = payrollData[0].total || 0;

    // Query 3: Pending leave requests
    const [pendingLeave] = await pool.query("SELECT COUNT(*) as count FROM leave_request WHERE status = 'Pending'");
    const pendingRequests = pendingLeave[0].count;

    // Query 4: Average performance score
    const [performanceData] = await pool.query('SELECT AVG(performance_score) as avg FROM performance');
    const performanceRate = performanceData[0].avg ? parseFloat(performanceData[0].avg).toFixed(1) : 0;

    res.json({
      totalEmployees,
      payrollProcessed: parseFloat(payrollProcessed).toFixed(2),
      pendingRequests,
      performanceRate: `${performanceRate}%`
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};