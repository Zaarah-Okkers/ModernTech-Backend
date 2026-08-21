import express from 'express';
import { getDashboardStats, getRecentActivity } from '../controllers/dashboardController.js';
const router = express.Router();
router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);
export default router;
