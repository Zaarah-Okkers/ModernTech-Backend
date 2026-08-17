import express from "express";
import db from "../config/database.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, (req, res) => {
    const sql = `
        SELECT user_id, first_name, last_name, email, role
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [req.user.user_id], (err, results) => {
        if (err) {
            console.error("Profile database error:", err);

            return res.status(500).json({
                message: "Database error."
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            message: "Profile retrieved successfully!",
            user: results[0]
        });
    });
});

export default router;