import express from "express";

import {

    generateQR,

    verifyQR

} from "../controllers/qrController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

/*
=====================================================
Admin Routes
=====================================================
*/

// Generate Dynamic QR
router.post(

    "/generate",

    authMiddleware,

    adminMiddleware,

    generateQR

);

/*
=====================================================
Student Routes
=====================================================
*/

// Verify QR
router.post(

    "/verify",

    authMiddleware,

    verifyQR

);

export default router;