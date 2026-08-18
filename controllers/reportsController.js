import {
  getPerformanceReport,
  getAttendanceReport,
  getPayrollReport,
  getPendingLeaveCount
} from "../models/reportsModel.js";


// ===============================
// PERFORMANCE REPORT
// ===============================

export async function performanceReport(req, res) {
  try {
    const data = await getPerformanceReport();

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Performance report error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate performance report"
    });
  }
}


// ===============================
// ATTENDANCE REPORT
// ===============================

export async function attendanceReport(req, res) {
  try {
    const data = await getAttendanceReport();

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Attendance report error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate attendance report"
    });
  }
}


// ===============================
// PAYROLL REPORT
// ===============================

export async function payrollReport(req, res) {
  try {
    const data = await getPayrollReport();

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error("Payroll report error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate payroll report"
    });
  }
}


// ===============================
// PENDING LEAVE
// ===============================

export async function pendingLeaveReport(req, res) {
  try {
    const pendingLeave = await getPendingLeaveCount();

    res.status(200).json({
      success: true,
      data: {
        pendingLeave
      }
    });

  } catch (error) {
    console.error("Pending leave error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve pending leave"
    });
  }
}