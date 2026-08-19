import { query } from '../config/database.js';

export const Payroll = {
    findByEmployee: async (employeeId) => {
        const sql = `
            SELECT p.*,
                   CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                   e.position AS job_title
            FROM payroll p
            JOIN employees e ON p.employee_id = e.employees_id
            WHERE p.employee_id = ?
            ORDER BY p.pay_period DESC
        `;
        return await query(sql, [employeeId]);
    },

    findByEmployeeAndPeriod: async (employeeId, payPeriod) => {
        const sql = `
            SELECT p.*,
                   CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                   e.position AS job_title
            FROM payroll p
            JOIN employees e ON p.employee_id = e.employees_id
            WHERE p.employee_id = ? AND p.pay_period = ?
        `;
        const results = await query(sql, [employeeId, payPeriod]);
        return results[0] || null;
    },

    findByPeriod: async (payPeriod) => {
        const sql = `
            SELECT p.*,
                   CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                   e.position AS job_title
            FROM payroll p
            JOIN employees e ON p.employee_id = e.employees_id
            WHERE p.pay_period = ?
            ORDER BY e.first_name
        `;
        return await query(sql, [payPeriod]);
    },

    createOrUpdate: async (payrollData) => {
        const {
            employee_id,
            pay_period,
            hours_worked,
            leave_deductions = 0,
            gross_pay,
            deductions = 0,
        } = payrollData;

        const net_pay = gross_pay - deductions;

        const existing = await query(
            'SELECT payroll_id FROM payroll WHERE employee_id = ? AND pay_period = ?',
            [employee_id, pay_period]
        );

        if (existing.length > 0) {
            await query(
                `UPDATE payroll
                 SET hours_worked = ?, leave_deductions = ?, gross_pay = ?, deductions = ?, net_pay = ?
                 WHERE employee_id = ? AND pay_period = ?`,
                [hours_worked, leave_deductions, gross_pay, deductions, net_pay, employee_id, pay_period]
            );
            return { affected: 1, id: existing[0].payroll_id };
        }

        const result = await query(
            `INSERT INTO payroll
               (employee_id, pay_period, hours_worked, leave_deductions, gross_pay, deductions, net_pay)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [employee_id, pay_period, hours_worked, leave_deductions, gross_pay, deductions, net_pay]
        );
        return { affected: 1, id: result.insertId };
    },

    getPeriods: async () => {
        const sql = `SELECT DISTINCT pay_period FROM payroll ORDER BY pay_period DESC`;
        return await query(sql);
    },

    getSummary: async () => {
        const currentPeriod = new Date().toISOString().slice(0, 7);
        const sql = `
            SELECT
                COUNT(*) AS total_processed,
                COALESCE(SUM(net_pay), 0) AS total_payroll
            FROM payroll
            WHERE pay_period = ?
        `;
        const results = await query(sql, [currentPeriod]);
        return results[0] || { total_processed: 0, total_payroll: 0 };
    }
};
