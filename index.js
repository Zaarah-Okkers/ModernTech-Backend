import "dotenv/config";
import express from "express";
import "./config/database.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        message: "HRFLOW Backend is running!"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});