import { query } from '../config/database.js';

export const Employee = {
    findAll: async () => {
        const sql = `
            SELECT e.id, e.employee_number, e.first_name, e.last_name,
                   e.email, e.job_title, d.name AS department_name
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            ORDER BY e.first_name
        `;
        return await query(sql);
    },

    findById: async (id) => {
        const sql = `
            SELECT e.*, d.name AS department_name
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            WHERE e.id = ?
        `;
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    count: async () => {
        const results = await query('SELECT COUNT(*) AS total FROM employees');
        return Number(results[0].total || 0);
    }
};