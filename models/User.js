import { query } from '../config/database.js';

export const User = {
    findByUsername: async (username) => {
        const results = await query('SELECT * FROM users WHERE username = ?', [username]);
        return results[0] || null;
    },

    findByEmail: async (email) => {
        const results = await query('SELECT * FROM users WHERE email = ?', [email]);
        return results[0] || null;
    },

    findById: async (id) => {
        const results = await query('SELECT * FROM users WHERE id = ?', [id]);
        return results[0] || null;
    }
};