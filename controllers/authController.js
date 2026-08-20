import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

export const authController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Validate input
            if (!username || !password) {
                return res.status(400).json({
                    message: 'Username and password are required'
                });
            }

            // Find user by username or email
            let user = await User.findByUsername(username);
            
            if (!user) {
                // Try email if username not found
                user = await User.findByEmail(username);
            }

            if (!user) {
                return res.status(401).json({
                    message: 'Invalid username or password.'
                });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            
            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Invalid username or password.'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    username: user.username,
                    email: user.email,
                    roleId: user.role_id
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRY }
            );

            // Return success response
            res.json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roleId: user.role_id
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                message: 'An error occurred during login. Please try again.'
            });
        }
    },

    getCurrentUser: async (req, res) => {
        try {
            const userId = req.user.userId;
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roleId: user.role_id
                }
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({
                message: 'Error fetching user data'
            });
        }
    }
};