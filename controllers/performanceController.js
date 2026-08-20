import { getAllPerformance } from "../models/performanceModel.js";

export async function getPerformance(req, res) {
  try {
    const performance = await getAllPerformance();

    res.status(200).json({
      success: true,
      data: performance
    });

  } catch (error) {

    console.error("Performance error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve performance data"
    });
  }
}