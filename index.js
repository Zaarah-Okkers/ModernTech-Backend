require("dotenv").config();
const express = require("express");
require("./config/database");

const authRoutes = require("./routes/auth");

const app = express();

// Allows Express to read JSON request bodies
app.use(express.json());

// Authentication routes
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