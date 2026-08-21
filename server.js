import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import dashboardRoutes from './routes/dashboard.js';
import payrollRoutes from './routes/payroll.js';
import leaveRoutes from './routes/leave.js';
import attendanceRoutes from './routes/attendance.js';
import performanceRoutes from './routes/performanceRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
// Middleware
app.use(cors({
    origin: [
        'http://localhost:4000',
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'https://hrflow-xg3y.onrender.com'
    ],
    credentials: true
}));
app.use(express.json());
// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'HRFlow API is running' });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: err.message || 'An unexpected error occurred'
    });
});
// Start server
const startServer = async () => {
    try {
        await testConnection();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Auth API: http://localhost:${PORT}/api/auth`);
            console.log(`Payroll API: http://localhost:${PORT}/api/payroll`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
