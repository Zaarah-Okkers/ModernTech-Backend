import { testConnection, query } from './config/database.js';

console.log('Testing database connection...');

const connected = await testConnection();

if (connected) {
    console.log('Database connected successfully');
    
    // Check if employees exist
    try {
        const employees = await query('SELECT COUNT(*) as count FROM employees');
        console.log(`Total employees: ${employees[0].count}`);
    } catch (e) {
        console.log('Could not check employees:', e.message);
    }
    
    // Check if payroll exists
    try {
        const payroll = await query('SELECT COUNT(*) as count FROM payroll');
        console.log(`Total payroll records: ${payroll[0].count}`);
    } catch (e) {
        console.log('Could not check payroll:', e.message);
    }
} else {
    console.log('Database connection failed');
}
