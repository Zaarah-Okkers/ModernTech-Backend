import db from "../config/database.js";

// GET ALL LEAVE REQUESTS
const getAllLeaveRequests = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT
                leave_id,
                employees_id,
                leave_date,
                reason,
                status
            FROM leave_request
        `);

        return res.status(200).json({
            message: "Leave requests retrieved successfully",
            leave_requests: results
        });

    } catch (error) {
        console.error("Get leave requests error:", error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};


// GET ONE LEAVE REQUEST
const getLeaveRequestById = async (req, res) => {
    try {
        const { id } = req.params;

        const [results] = await db.query(`
            SELECT
                leave_id,
                employees_id,
                leave_date,
                reason,
                status
            FROM leave_request
            WHERE leave_id = ?
        `, [id]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        return res.status(200).json({
            message: "Leave request retrieved successfully",
            leave_request: results[0]
        });

    } catch (error) {
        console.error("Get leave request error:", error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};


// CREATE LEAVE REQUEST
const createLeaveRequest = async (req, res) => {
    try {
        const {
            employees_id,
            leave_date,
            reason
        } = req.body;

        if (!employees_id || !leave_date || !reason) {
            return res.status(400).json({
                message: "employees_id, leave_date and reason are required"
            });
        }

        const [result] = await db.query(`
            INSERT INTO leave_request
            (employees_id, leave_date, reason, status)
            VALUES (?, ?, ?, ?)
        `, [
            employees_id,
            leave_date,
            reason,
            "Pending"
        ]);

        return res.status(201).json({
            message: "Leave request created successfully",
            leave_id: result.insertId
        });

    } catch (error) {
        console.error("Create leave request error:", error);

        return res.status(500).json({
            message: "Database error"
        });
    }
};


// UPDATE LEAVE REQUEST
const updateLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            employees_id,
            leave_date,
            reason,
            status
        } = req.body;

        const [result] = await db.query(`
            UPDATE leave_request
            SET
                employees_id = ?,
                leave_date = ?,
                reason = ?,
                status = ?
            WHERE leave_id = ?
        `, [
            employees_id,
            leave_date,
            reason,
            status,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        return res.status(200).json({
            message: "Leave request updated successfully"
        });

    } catch (error) {
        console.error("Update leave request error:", error);

        return res.status(500).json({
            message: "Failed to update leave request"
        });
    }
};


// DELETE LEAVE REQUEST
const deleteLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(`
            DELETE FROM leave_request
            WHERE leave_id = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        return res.status(200).json({
            message: "Leave request deleted successfully"
        });

    } catch (error) {
        console.error("Delete leave request error:", error);

        return res.status(500).json({
            message: "Failed to delete leave request"
        });
    }
};


// EXPORTS
export {
    getAllLeaveRequests,
    getLeaveRequestById,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest
};