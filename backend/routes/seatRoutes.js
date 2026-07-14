import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

import {
    addSeat,
    vacateSeat,
    deleteSeat,
    getAllSeats,
    getAvailableSeats,
    getSeatById,
    updateSeat,
    getAllRequests,
    getMySeat,
    getSeatMasterData
} from "../controllers/seatController.js";

import {
    approveSeatRequest,
    cancelSeatRequest,
    createSeatRequest,
    getPendingSeatRequests,
    mySeatRequests,
    rejectSeatRequest
} from "../controllers/seatRequestController.js";

const router = express.Router();

// =========================
// GET Routes
// =========================

router.get("/all", authMiddleware, adminMiddleware, getAllSeats);

router.get("/available", authMiddleware, getAvailableSeats);

router.get("/requests", authMiddleware, adminMiddleware, getAllRequests);

router.get("/my-requests", authMiddleware, mySeatRequests);

router.get("/pending", authMiddleware, adminMiddleware, getPendingSeatRequests);

router.get("/my",authMiddleware,getMySeat)

router.get(
    "/master-data",
    authMiddleware,
    adminMiddleware,
    getSeatMasterData
);
// =========================
// POST Routes
// =========================

router.post("/add", authMiddleware, adminMiddleware, addSeat);

router.post("/create", authMiddleware, createSeatRequest);

// =========================
// PUT Routes
// =========================

router.put("/vacate/:seatId", authMiddleware, adminMiddleware, vacateSeat);

router.put("/update/:id", authMiddleware, adminMiddleware, updateSeat);

router.put("/cancel/:id", authMiddleware, cancelSeatRequest);

router.put("/approve/:id", authMiddleware, adminMiddleware, approveSeatRequest);

router.put("/reject/:id", authMiddleware, adminMiddleware, rejectSeatRequest);

// =========================
// DELETE Routes
// =========================

router.delete("/delete/:seatId", authMiddleware, adminMiddleware, deleteSeat);

// =========================
// Dynamic Route (Always Last)
// =========================

router.get("/:id", authMiddleware, adminMiddleware, getSeatById);

export default router;