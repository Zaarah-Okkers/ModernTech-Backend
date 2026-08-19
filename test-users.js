import { query } from './config/database.js';

console.log('Checking users...');

try {
    const users = await query('SELECT id, username, email, role_id FROM users');
    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
        console.log(`  - ${u.username} (${u.email})`);
    });

    if (users.length === 0) {
        console.log('');
        console.log('⚠️ No users found! You need to add a test user.');
        console.log('');
        console.log('Run this SQL in your database:');
        console.log('INSERT INTO users (username, email, password_hash, role_id)');
        console.log('VALUES ("admin", "admin@test.com", "$2b$10$micBhbUvbwlQN/tc2TuNr.l099BtBRlTXwuIc0sQgiPnUz47vQEXO", 1);');
    }
} catch (e) {
    console.log(' Error checking users:', e.message);
}
