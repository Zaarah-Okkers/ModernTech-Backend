import { query } from '../config/database.js';

export const User = {
    findByUsername: async (username) => {
        const results = await query('SELECT * FROM users WHERE username = ?', [username]);
        return results[0] || null;
    }
};