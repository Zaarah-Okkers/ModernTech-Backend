import express from 'express';
import { payrollController } from '../controllers/payrollController.js';
import { authenticate, authorize, ROLES } from '../middleware/auth.js';

const router = express.Router();

// All payroll routes require authentication
router.use(authenticate);

// Get payroll summary (dashboard)
router.get('/summary', payrollController.getSummary);

// Get payroll periods
router.get('/periods', payrollController.getPeriods);

// Get payroll by period (all employees)
router.get('/period/:payPeriod', payrollController.getByPeriod);

// Get all payroll rows for one employee
router.get('/employee/:employeeId', payrollController.getByEmployee);

// Get payroll by employee and period
router.get('/employee/:employeeId/period/:payPeriod', payrollController.getByEmployeeAndPeriod);

// Create or update payroll (HR only)
router.post('/', authorize(ROLES.HR_STAFF), payrollController.createOrUpdate);

export default router;