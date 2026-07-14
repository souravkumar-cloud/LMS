import express from "express";

import {

    createPayment,

    paymentHistory,

    totalRevenue,

    downloadReceipt

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

// Total Revenue
router.get(

    "/revenue",

    authMiddleware,

    adminMiddleware,

    totalRevenue

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