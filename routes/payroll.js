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
            JOIN employees e ON p.employees_id = e.employees_id
            LEFT JOIN departments d ON e.department_id = d.department_id
            WHERE p.employees_id = ?
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
                employees_id: employeeId,
                full_name: `${employee[0].first_name} ${employee[0].last_name}`,
                position: employee[0].position,
                department: employee[0].department_name,
                base_salary: employee[0].salary || 0,
                hours_worked: 0,
                leave_deductions: 0,
                final_salary: employee[0].salary || 0,
                message: 'No payroll record found. Showing base salary.'
            });
        }

        res.json(payroll[0]);
    } catch (error) {
        console.error('Error fetching employee payroll:', error);
        res.status(500).json({ 
            message: 'Error fetching employee payroll' 
        });
    }
});

// ============================================
// CALCULATE PAYROLL
// ============================================
router.post('/calculate', authenticateToken, async (req, res) => {
    try {
        const {
            employeeId,
            monthlyBase,
            hoursWorked = 0,
            leaveHours = 0,
            bonus = 0,
            taxRate = 18
        } = req.body;

        // Validate required fields
        if (!employeeId) {
            return res.status(400).json({ 
                success: false,
                message: 'Employee ID is required' 
            });
        }

        if (!monthlyBase || monthlyBase <= 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Valid base salary is required' 
            });
        }

        // Calculate payroll
        const hourlyRate = monthlyBase / 160; // 160 hours per month
        const leaveDeduction = leaveHours * hourlyRate;
        const grossPay = monthlyBase + bonus;
        const taxAmount = grossPay * (taxRate / 100);
        const totalDeductions = taxAmount + leaveDeduction;
        const netPay = grossPay - totalDeductions;

        // Get employee details
        const employee = await query(
            'SELECT first_name, last_name, position FROM employees WHERE employees_id = ?',
            [employeeId]
        );

        const employeeName = employee.length > 0 
            ? `${employee[0].first_name} ${employee[0].last_name}` 
            : 'Unknown';

        // Your payroll table stores one row per employee (no pay-period column),
        // so we update the existing row if one exists, otherwise insert a new one.
        const existingPayroll = await query(
            `SELECT * FROM payroll WHERE employees_id = ?`,
            [employeeId]
        );

        if (existingPayroll.length > 0) {
            // Update existing record
            await query(
                `UPDATE payroll 
                 SET hours_worked = ?, leave_deductions = ?, final_salary = ?
                 WHERE employees_id = ?`,
                [hoursWorked, leaveDeduction, netPay, employeeId]
            );
        } else {
            // Create new record
            await query(
                `INSERT INTO payroll 
                (employees_id, hours_worked, leave_deductions, final_salary)
                VALUES (?, ?, ?, ?)`,
                [employeeId, hoursWorked, leaveDeduction, netPay]
            );
        }

        // Return calculation result
        res.json({
            success: true,
            message: 'Payroll calculated successfully',
            employee: {
                employees_id: employeeId,
                full_name: employeeName
            },
            calculation: {
                base_salary: parseFloat(monthlyBase),
                bonus: parseFloat(bonus),
                leave_hours: parseFloat(leaveHours),
                hourly_rate: parseFloat(hourlyRate.toFixed(2)),
                leave_deduction: parseFloat(leaveDeduction.toFixed(2)),
                gross_pay: parseFloat(grossPay.toFixed(2)),
                tax_rate: parseFloat(taxRate),
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
            JOIN employees e ON p.employees_id = e.employees_id
            LEFT JOIN departments d ON e.department_id = d.department_id
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
