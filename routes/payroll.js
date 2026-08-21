import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// GET ALL EMPLOYEES (for payroll dropdown)
// ============================================
router.get('/employees', authenticateToken, async (req, res) => {
    try {
        const employees = await query(`
            SELECT 
                e.employees_id,
                e.first_name,
                e.last_name,
                e.position,
                e.salary,
                d.department_name
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.department_id
            ORDER BY e.first_name, e.last_name
        `);

        res.json({ employees });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ 
            message: 'Error fetching employees' 
        });
    }
});

// ============================================
// GET PAYROLL FOR SPECIFIC EMPLOYEE
// ============================================
router.get('/employee/:employeeId', authenticateToken, async (req, res) => {
    try {
        const employeeId = req.params.employeeId;

        const payroll = await query(`
            SELECT 
                p.*,
                e.first_name,
                e.last_name,
                e.position,
                d.department_name,
                e.salary as base_salary
            FROM payroll p
            JOIN employees e ON p.employee_id = e.employees_id
            LEFT JOIN departments d ON e.department_id = d.department_id
            WHERE p.employee_id = ?
            ORDER BY p.pay_period DESC
            LIMIT 1
        `, [employeeId]);

        if (payroll.length === 0) {
            // If no payroll record exists, return employee data with default values
            const employee = await query(
                `SELECT e.*, d.department_name 
                 FROM employees e 
                 LEFT JOIN departments d ON e.department_id = d.department_id
                 WHERE e.employees_id = ?`,
                [employeeId]
            );
            
            if (employee.length === 0) {
                return res.status(404).json({ 
                    message: 'Employee not found' 
                });
            }

            return res.json({
                employee_id: employeeId,
                full_name: `${employee[0].first_name} ${employee[0].last_name}`,
                position: employee[0].position,
                department: employee[0].department_name,
                base_salary: employee[0].salary || 0,
                bonus: 0,
                leave_deductions: 0,
                tax_rate: 18,
                net_pay: employee[0].salary || 0,
                message: 'No payroll record found. Showing base salary.'
            });
        }

        res.json(payroll[0]);
    } catch (error) {
        console.error('Error fetching employee payroll:', error);
        res.status(500).json({ 
            message: 'Error fetching employee payroll',
            debug: error.message   // TEMPORARY - remove once bug is found
        });
    }
});

// ============================================
// CALCULATE PAYROLL
// ============================================
router.post('/calculate', authenticateToken, async (req, res) => {
    try {
        const { 
            employee_id, 
            base_salary, 
            bonus = 0, 
            leave_hours = 0,
            tax_rate = 18 
        } = req.body;

        // Validate required fields
        if (!employee_id) {
            return res.status(400).json({ 
                success: false,
                message: 'Employee ID is required' 
            });
        }

        if (!base_salary || base_salary <= 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Valid base salary is required' 
            });
        }

        // Calculate payroll
        const hourlyRate = base_salary / 160; // 160 hours per month
        const leaveDeduction = leave_hours * hourlyRate;
        const grossPay = base_salary + bonus;
        const taxAmount = grossPay * (tax_rate / 100);
        const totalDeductions = taxAmount + leaveDeduction;
        const netPay = grossPay - totalDeductions;

        // Get employee details
        const employee = await query(
            'SELECT first_name, last_name, position FROM employees WHERE employees_id = ?',
            [employee_id]
        );

        const employeeName = employee.length > 0 
            ? `${employee[0].first_name} ${employee[0].last_name}` 
            : 'Unknown';

        // Save or update payroll record, keyed by pay period (YYYY-MM)
        const now = new Date();
        const payPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // Check if payroll record exists for this period
        const existingPayroll = await query(
            `SELECT * FROM payroll WHERE employee_id = ? AND pay_period = ?`,
            [employee_id, payPeriod]
        );

        if (existingPayroll.length > 0) {
            // Update existing record
            await query(
                `UPDATE payroll 
                 SET hours_worked = ?, leave_deductions = ?, gross_pay = ?, 
                     deductions = ?, net_pay = ?
                 WHERE employee_id = ? AND pay_period = ?`,
                [leave_hours, leaveDeduction, grossPay, totalDeductions, netPay, 
                 employee_id, payPeriod]
            );
        } else {
            // Create new record
            await query(
                `INSERT INTO payroll 
                (employee_id, hours_worked, leave_deductions, net_pay, pay_period, gross_pay, deductions)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [employee_id, leave_hours, leaveDeduction, netPay, payPeriod, grossPay, totalDeductions]
            );
        }

        // Return calculation result
        res.json({
            success: true,
            message: 'Payroll calculated successfully',
            employee: {
                employee_id: employee_id,
                full_name: employeeName
            },
            calculation: {
                base_salary: parseFloat(base_salary),
                bonus: parseFloat(bonus),
                leave_hours: parseFloat(leave_hours),
                hourly_rate: parseFloat(hourlyRate.toFixed(2)),
                leave_deduction: parseFloat(leaveDeduction.toFixed(2)),
                gross_pay: parseFloat(grossPay.toFixed(2)),
                tax_rate: parseFloat(tax_rate),
                tax_amount: parseFloat(taxAmount.toFixed(2)),
                total_deductions: parseFloat(totalDeductions.toFixed(2)),
                net_pay: parseFloat(netPay.toFixed(2))
            }
        });

    } catch (error) {
        console.error('Error calculating payroll:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error calculating payroll' 
        });
    }
});

// ============================================
// GET ALL PAYROLL RECORDS (Optional)
// ============================================
router.get('/all', authenticateToken, async (req, res) => {
    try {
        const payroll = await query(`
            SELECT 
                p.*,
                e.first_name,
                e.last_name,
                e.position,
                d.department_name
            FROM payroll p
            JOIN employees e ON p.employee_id = e.employees_id
            LEFT JOIN departments d ON e.department_id = d.department_id
            ORDER BY p.pay_period DESC
            LIMIT 50
        `);

        res.json(payroll);
    } catch (error) {
        console.error('Error fetching all payroll:', error);
        res.status(500).json({ 
            message: 'Error fetching payroll data' 
        });
    }
});

export default router;
