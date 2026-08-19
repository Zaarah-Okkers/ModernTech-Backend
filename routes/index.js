import express from 'express';
import payrollRoutes from './payroll.js';

const router = express.Router();

// Mount payroll routes
router.use('/payroll', payrollRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'HRFlow API is running'
    });
});

export default router;