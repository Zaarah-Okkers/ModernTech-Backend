import { User } from '../models/User.js';
import { comparePassword } from '../utils/bcryptHelper.js';
import { generateToken } from '../utils/jwtHelper.js';

export const authController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
            const passwordMatches = await comparePassword(password, user.password_hash);
            if (!passwordMatches) {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }
            const token = generateToken(user);
            res.json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Something went wrong while logging in.' });
        }
    }
};