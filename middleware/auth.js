import { verifyToken } from '../utils/jwtHelper.js';

// Authentication middleware - verifies JWT token
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Authentication required. Please provide a valid token.' 
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Authentication token is missing.' 
            });
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.message === 'Token expired') {
            return res.status(401).json({ 
                message: 'Your session has expired. Please log in again.' 
            });
        }
        if (error.message === 'Invalid token') {
            return res.status(403).json({ 
                message: 'Invalid authentication token.' 
            });
        }
        console.error('Auth error:', error);
        return res.status(500).json({ 
            message: 'Authentication error. Please try again.' 
        });
    }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                message: 'Authentication required.' 
            });
        }

        const userRole = req.user.roleId;
        
        // Get role names from database or use role IDs
        // For simplicity, assuming roles: 1=hr_staff, 2=manager, 3=employee
        
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ 
                message: 'You do not have permission to perform this action.' 
            });
        }
    };
};

// Optional: Roles mapping for easier use
export const ROLES = {
    HR_STAFF: 1,
    MANAGER: 2,
    EMPLOYEE: 3
};