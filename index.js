import "dotenv/config";
import express from "express";
import cors from "cors";
import "./config/database.js";
import authRoutes from "./routes/auth.js";
import leaveRoutes from "./routes/leave.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

app.use("/api/leave", leaveRoutes);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.json({
        message: "HRFLOW Backend is running!"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});