import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required."
      });
    }

    const [users] = await db.execute(
      `
      SELECT 
        u.user_id,
        u.employees_id,
        u.username,
        u.email,
        u.password_hash,
        e.first_name,
        e.last_name,
        e.position,
        e.department_id
      FROM users u
      JOIN employees e 
        ON u.employees_id = e.employees_id
      WHERE u.username = ? OR u.email = ?
      LIMIT 1
      `,
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid username or password."
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password."
      });
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        employeeId: user.employees_id,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        userId: user.user_id,
        employeeId: user.employees_id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        position: user.position,
        departmentId: user.department_id
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login."
    });
  }
};