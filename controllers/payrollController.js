import { query } from '../config/database.js';
import { Payroll } from '../models/Payroll.js';
import { Employee } from '../models/Employee.js';

export const payrollController = {
    getByEmployee: async (req, res) => {
        try {
            const { employeeId } = req.params;
            const payroll = await Payroll.findByEmployee(employeeId);

            if (!payroll || payroll.length === 0) {
                return res.status(404).json({
                    message: 'No payroll records found for this employee'
                });
            }

            res.json(payroll);
        } catch (error) {
            console.error('Error fetching employee payroll:', error);
            res.status(500).json({
                message: 'Error fetching payroll records for employee'
            });
        }
    },

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

    createOrUpdate: async (req, res) => {
        try {
            const payrollData = req.body;
            
            console.log('Received payroll data:', payrollData);
            
            const required = ['employee_id', 'pay_period', 'hours_worked', 'gross_pay'];
            for (const field of required) {
                if (payrollData[field] === undefined || payrollData[field] === null) {
                    return res.status(400).json({
                        message: `Missing required field: ${field}`
                    });
                }
            }

            // Check if employee exists
            const employeeCheck = await query(
                'SELECT employees_id FROM employees WHERE employees_id = ?',
                [payrollData.employee_id]
            );
            
            console.log('Employee check result:', employeeCheck);
            
            if (!employeeCheck || employeeCheck.length === 0) {
                return res.status(404).json({
                    message: 'Employee not found'
                });
            }

            const result = await Payroll.createOrUpdate(payrollData);
            console.log('Create/Update result:', result);
            
            const updated = await Payroll.findByEmployeeAndPeriod(
                payrollData.employee_id, 
                payrollData.pay_period
            );
            
            res.json({
                message: 'Payroll record saved successfully',
                payroll: updated
            });
        } catch (error) {
            console.error('Detailed error saving payroll:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                message: 'Error saving payroll record',
                details: error.message,
                sql: error.sql || null
            });
        }
    },

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
    },

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
    }
};