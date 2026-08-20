import "dotenv/config";
import express from "express";
import cors from "cors";
import "./config/database.js";
import authRoutes from "./routes/auth.js";
import leaveRoutes from "./routes/leave.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const allowedOrigins = [
    "http://localhost:4000",
    "http://127.0.0.1:4000",
    "http://localhost:3000",
    "https://hrflow-xg3y.onrender.com",
    "https://moderntech-backend-1.onrender.com",
    "http://moderntech-backend-1.onrender.com"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "HRFLOW Backend is running!"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});