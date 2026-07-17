import express from "express";

import {
    createPayment,
    paymentHistory,
    totalRevenue,
    downloadReceipt,
    deletePayment,
    collectPayment
} from "../controllers/paymentController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

/*
====================================================
Admin Routes
====================================================
*/

// Create Payment
router.post(
    "/create",
    authMiddleware,
    adminMiddleware,
    createPayment
);

// Collect Payment
router.put(
    "/collect/:id",
    authMiddleware,
    adminMiddleware,
    collectPayment
);

// Total Revenue
router.get(

    "/revenue",

    authMiddleware,

    adminMiddleware,

    totalRevenue

);

router.delete(

    "/delete/:id",

    authMiddleware,

    adminMiddleware,

    deletePayment

);

/*
====================================================
Student Routes
====================================================
*/

// Payment History
router.get(

    "/history",

    authMiddleware,

    paymentHistory

);

router.get("/receipt/:id",authMiddleware,downloadReceipt);

export default router;