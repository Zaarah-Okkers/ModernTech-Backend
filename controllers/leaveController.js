import db from "../config/database.js";


// GET ALL LEAVE REQUESTS
const getAllLeaveRequests = (req, res) => {

    const sql = `
        SELECT
            leave_id,
            employees_id,
            leave_date,
            reason,
            status
        FROM leave_request
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Get leave requests error:", err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        return res.status(200).json({
            message: "Leave requests retrieved successfully",
            leave_requests: results
        });
    });
};


// GET ONE LEAVE REQUEST
const getLeaveRequestById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            leave_id,
            employees_id,
            leave_date,
            reason,
            status
        FROM leave_request
        WHERE leave_id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.error("Get leave request error:", err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        return res.status(200).json({
            message: "Leave request retrieved successfully",
            leave_request: results[0]
        });
    });
};


// CREATE LEAVE REQUEST
const createLeaveRequest = (req, res) => {

    const {
        employees_id,
        leave_date,
        reason
    } = req.body;

    // Check required fields
    if (!employees_id || !leave_date || !reason) {
        return res.status(400).json({
            message: "employees_id, leave_date and reason are required"
        });
    }

    const sql = `
        INSERT INTO leave_request
        (employees_id, leave_date, reason, status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employees_id,
            leave_date,
            reason,
            "Pending"
        ],
        (err, result) => {

            if (err) {
                console.error("Create leave request error:", err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            return res.status(201).json({
                message: "Leave request created successfully",
                leave_id: result.insertId
            });
        }
    );
};

// UPDATE LEAVE REQUEST
const updateLeaveRequest = (req, res) => {
    const { id } = req.params;
    const { employees_id, leave_date, reason, status } = req.body;

    const sql = `
        UPDATE leave_request
        SET
            employees_id = ?,
            leave_date = ?,
            reason = ?,
            status = ?
        WHERE leave_id = ?
    `;

    db.query(
        sql,
        [employees_id, leave_date, reason, status, id],
        (err, result) => {
            if (err) {
                console.error("Update leave request error:", err);
                return res.status(500).json({
                    message: "Failed to update leave request"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Leave request not found"
                });
            }

            res.status(200).json({
                message: "Leave request updated successfully"
            });
        }
    );
};

// DELETE LEAVE REQUEST
const deleteLeaveRequest = (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM leave_request
        WHERE leave_id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Delete leave request error:", err);
            return res.status(500).json({
                message: "Failed to delete leave request"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json({
            message: "Leave request deleted successfully"
        });
    });
};

// EXPORTS
export {
    getAllLeaveRequests,
    getLeaveRequestById,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest
};