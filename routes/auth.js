import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { query } from '../config/database.js';

dotenv.config();
const router = express.Router();

// ============================================
// LOGIN API
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Username and password are required' 
            });
        }

        console.log(`Login attempt for: ${username}`);

        // Find user by username OR email
        const users = await query(
            `SELECT 
                u.id,
                u.username,
                u.email,
                u.password_hash,
                u.role_id,
                r.role_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.role_id
            WHERE u.username = ? OR u.email = ?`,
            [username, username]
        );

        // Check if user exists
        if (users.length === 0) {
            console.log(`Login failed: User not found - ${username}`);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            console.log(`❌ Login failed: Invalid password for ${username}`);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password' 
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { 
                user_id: user.id,
                username: user.username,
                email: user.email,
                role: user.role_name || 'employee'
            },
            process.env.JWT_SECRET || 'your_secret_key_here',
            { expiresIn: '24h' }
        );

        // Remove password hash from response
        const { password_hash, ...userData } = user;

        console.log(`✅ Login successful: ${username}`);
        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: userData,
            expiresIn: '24h'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login. Please try again.' 
        });
    }
});

// ============================================
// GET USER PROFILE (Optional)
// ============================================
router.get('/profile', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
        
        const users = await query(
            `SELECT 
                u.id,
                u.username,
                u.email,
                u.role_id,
                r.role_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.role_id
            WHERE u.id = ?`,
            [decoded.user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }
        console.error('Profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error fetching profile' 
        });
    }
});

export default router;
