const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// REGISTER


router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Check that all fields were provided
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    // Check password strength
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long."
        });
    }

    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least one uppercase letter."
        });
    }

    if (!/[a-z]/.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least one lowercase letter."
        });
    }

    if (!/[0-9]/.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least one number."
        });
    }

    try {
        // Check if the email already exists
        const checkSql = "SELECT user_id FROM users WHERE email = ?";

        db.query(checkSql, [email], async (err, results) => {
            if (err) {
                console.error("Database error:", err);

                return res.status(500).json({
                    message: "Database error."
                });
            }

            // Email already exists
            if (results.length > 0) {
                return res.status(409).json({
                    message: "Email is already registered."
                });
            }

            // Hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            // Insert the new user
            const sql = `
                INSERT INTO users
                (first_name, last_name, email, password_hash)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                sql,
                [first_name, last_name, email, passwordHash],
                (err, result) => {
                    if (err) {
                        console.error("Registration error:", err);

                        return res.status(500).json({
                            message: "Failed to create user."
                        });
                    }

                    return res.status(201).json({
                        message: "User registered successfully!",
                        user_id: result.insertId
                    });
                }
            );
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Something went wrong."
        });
    }
});


// LOGIN


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check that both fields were provided
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    try {
        // Find the user by email
        const sql = `
            SELECT user_id, first_name, last_name, email, password_hash
            FROM users
            WHERE email = ?
        `;

        db.query(sql, [email], async (err, results) => {
            if (err) {
                console.error("Login database error:", err);

                return res.status(500).json({
                    message: "Database error."
                });
            }

            // User doesn't exist
            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            const user = results[0];

            // Compare entered password with stored bcrypt hash
            const passwordMatch = await bcrypt.compare(
                password,
                user.password_hash
            );

            // Password is incorrect
            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            // Create JWT token
            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            // Login successful
            return res.status(200).json({
                message: "Login successful!",
                token: token,
                user: {
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
            });
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Something went wrong."
        });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const sql = `
            SELECT user_id, first_name, last_name, email
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

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            message: "Something went wrong."
        });
    }
});

module.exports = router;