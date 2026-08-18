import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "HRFlow backend is running."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HRFlow backend running on port ${PORT}`);
});