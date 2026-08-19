import { getReports } from "../models/reportsModel.js";

export const getReportsData = async (req, res) => {
  try {
    const reports = await getReports();

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });

  } catch (error) {
    console.error("Reports error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve reports data",
      error: error.message
    });
  }
};