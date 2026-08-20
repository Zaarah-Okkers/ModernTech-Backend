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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        console.log(`Login attempt for: ${email}`);

        const users = await query(
            `SELECT
                user_id,
                first_name,
                last_name,
                email,
                password_hash,
                role
            FROM users
            WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            console.log(`Login failed: User not found - ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            console.log(`Login failed: Invalid password for ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'your_secret_key_here',
            { expiresIn: '24h' }
        );

        const { password_hash, ...userData } = user;

        console.log(`Login successful: ${email}`);
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
// GET USER PROFILE
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
                user_id,
                first_name,
                last_name,
                email,
                role
            FROM users
            WHERE user_id = ?`,
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