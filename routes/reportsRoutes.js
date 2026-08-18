import express from "express";

import {
  performanceReport,
  attendanceReport,
  payrollReport,
  pendingLeaveReport
} from "../controllers/reportsController.js";

const router = express.Router();

router.get("/performance", performanceReport);

router.get("/attendance", attendanceReport);

router.get("/payroll", payrollReport);

router.get("/pending-leave", pendingLeaveReport);

export default router;