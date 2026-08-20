import { Payroll } from '../models/Payroll.js';
import { Employee } from '../models/Employee.js';
import { comparePassword } from '../utils/bcryptHelper.js';
import { generateToken } from '../utils/jwtHelper.js';
import { query } from '../config/database.js';

export const payrollController = {
    // ===== LOGIN METHOD =====
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    message: 'Username and password are required'
                });
            }

            // Find user by username or email
            const sql = `
                SELECT u.*, r.role_name 
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                WHERE u.username = ? OR u.email = ?
            `;
            const users = await query(sql, [username, username]);
            const user = users[0];

            if (!user) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            // Compare password
            const isValidPassword = await comparePassword(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = generateToken({
                id: user.id,
                username: user.username,
                email: user.email,
                role_id: user.role_id
            });

            res.json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role_id: user.role_id,
                    role_name: user.role_name
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                message: 'Server error during login'
            });
        }
    },

    // ===== GET ALL EMPLOYEES =====
    getEmployees: async (req, res) => {
        try {
            const employees = await Employee.findAll();
            res.json(employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
            res.status(500).json({
                message: 'Error fetching employees'
            });
        }
    },

    // ===== GET PAYROLL BY EMPLOYEE AND PERIOD =====
    getByEmployeeAndPeriod: async (req, res) => {
        try {
            const { employeeId, payPeriod } = req.params;
            const payroll = await Payroll.findByEmployeeAndPeriod(employeeId, payPeriod);
            
            if (!payroll) {
                return res.status(404).json({
                    message: 'Payroll record not found for this period'
                });
            }
            
            res.json(payroll);
        } catch (error) {
            console.error('Error fetching payroll:', error);
            res.status(500).json({
                message: 'Error fetching payroll record'
            });
        }
    },

    // ===== GET PAYROLL BY PERIOD =====
    getByPeriod: async (req, res) => {
        try {
            const { payPeriod } = req.params;
            const payroll = await Payroll.findByPeriod(payPeriod);
            res.json(payroll);
        } catch (error) {
            console.error('Error fetching payroll period:', error);
            res.status(500).json({
                message: 'Error fetching payroll records'
            });
        }
    },

    // ===== CREATE OR UPDATE PAYROLL =====
    createOrUpdate: async (req, res) => {
        try {
            const payrollData = req.body;
            
            const required = ['employee_id', 'pay_period', 'hours_worked', 'gross_pay'];
            for (const field of required) {
                if (payrollData[field] === undefined || payrollData[field] === null) {
                    return res.status(400).json({
                        message: `Missing required field: ${field}`
                    });
                }
            }

            const employee = await Employee.findById(payrollData.employee_id);
            if (!employee) {
                return res.status(404).json({
                    message: 'Employee not found'
                });
            }

            const result = await Payroll.createOrUpdate(payrollData);
            
            const updated = await Payroll.findByEmployeeAndPeriod(
                payrollData.employee_id, 
                payrollData.pay_period
            );
            
            res.json({
                message: 'Payroll record saved successfully',
                payroll: updated
            });
        } catch (error) {
            console.error('Error saving payroll:', error);
            res.status(500).json({
                message: 'Error saving payroll record'
            });
        }
    },

    // ===== CALCULATE PAYROLL FROM ATTENDANCE =====
    calculateFromAttendance: async (req, res) => {
        try {
            const { employeeId, payPeriod } = req.params;
            
            const calculated = await Payroll.calculateFromAttendance(employeeId, payPeriod);
            
            const payrollData = {
                employee_id: parseInt(employeeId),
                pay_period: payPeriod,
                hours_worked: calculated.hours_worked,
                leave_deductions: calculated.leave_deductions,
                gross_pay: calculated.gross_pay,
                deductions: calculated.deductions,
                net_pay: calculated.net_pay
            };

            await Payroll.createOrUpdate(payrollData);
            
            const saved = await Payroll.findByEmployeeAndPeriod(employeeId, payPeriod);
            
            res.json({
                message: 'Payroll calculated and saved successfully',
                payroll: saved,
                calculation: {
                    present_days: calculated.present_days,
                    absent_days: calculated.absent_days,
                    leave_days: calculated.leave_days,
                    total_days: calculated.total_days,
                    hourly_rate: Math.round(calculated.gross_pay / 160)
                }
            });
        } catch (error) {
            console.error('Error calculating payroll:', error);
            res.status(500).json({
                message: error.message || 'Error calculating payroll'
            });
        }
    },

    // ===== GET PAYROLL SUMMARY =====
    getSummary: async (req, res) => {
        try {
            const summary = await Payroll.getSummary();
            res.json(summary);
        } catch (error) {
            console.error('Error fetching payroll summary:', error);
            res.status(500).json({
                message: 'Error fetching payroll summary'
            });
        }
    },

    // ===== GET ALL PAYROLL PERIODS =====
    getPeriods: async (req, res) => {
        try {
            const periods = await Payroll.getPeriods();
            res.json(periods);
        } catch (error) {
            console.error('Error fetching payroll periods:', error);
            res.status(500).json({
                message: 'Error fetching payroll periods'
            });
        }
    }
};