import express from 'express';
import { getEmployees, createEmployee, deleteEmployee, getDepartments } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', getEmployees);
router.get('/departments', getDepartments);
router.post('/', createEmployee);
router.delete('/:id', deleteEmployee);

export default router;
