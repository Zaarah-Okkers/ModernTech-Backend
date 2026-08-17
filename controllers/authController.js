import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/database.js";

// REGISTER
const register = async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;

    // Check required fields
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
        // Check if email already exists
        const checkSql = "SELECT user_id FROM users WHERE email = ?";

        db.query(checkSql, [email], async (err, results) => {
            if (err) {
                console.error("Database error:", err);

                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    message: "Email is already registered."
                });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Insert user
            const sql = `
                INSERT INTO users
                (first_name, last_name, email, password_hash, role)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    first_name,
                    last_name,
                    email,
                    passwordHash,
                    role || "employee"
                ],
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
};


// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    try {
        // Find user
        const sql = `
            SELECT user_id, first_name, last_name, email, password_hash, role
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

            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            const user = results[0];

            // Compare password with bcrypt hash
            const passwordMatch = await bcrypt.compare(
                password,
                user.password_hash
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            // Create JWT
            const token = jwt.sign(
                {
                    user_id: user.user_id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            return res.status(200).json({
                message: "Login successful!",
                token: token,
                user: {
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                }
            });
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Something went wrong."
        });
    }
};


export { register, login };