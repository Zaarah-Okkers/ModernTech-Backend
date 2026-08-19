import express from "express";

import {
    getAllLeaveRequests,
    getLeaveRequestById,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest
} from "../controllers/leaveController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// GET ALL
router.get("/", authMiddleware, getAllLeaveRequests);


// GET ONE
router.get("/:id", authMiddleware, getLeaveRequestById);


// CREATE
router.post("/", authMiddleware, createLeaveRequest);


// UPDATE
router.put("/:id", authMiddleware, updateLeaveRequest);


// DELETE
router.delete("/:id", authMiddleware, deleteLeaveRequest);


export default router;