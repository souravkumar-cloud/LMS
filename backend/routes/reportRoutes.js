import express from "express";

import {

    generateReport,

    exportStudentExcel,

    exportAttendanceExcel,

    exportPaymentExcel,

    exportSeatExcel

} from "../controllers/reportController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

/*
====================================================
Reports
====================================================
*/

// Dynamic Reports
router.get(

    "/",

    authMiddleware,

    adminMiddleware,

    generateReport

);

/*
====================================================
Excel Reports
====================================================
*/

// Student Excel
router.get(

    "/student/excel",

    authMiddleware,

    adminMiddleware,

    exportStudentExcel

);

// Attendance Excel
router.get(

    "/attendance/excel",

    authMiddleware,

    adminMiddleware,

    exportAttendanceExcel

);

// Payment Excel
router.get(

    "/payment/excel",

    authMiddleware,

    adminMiddleware,

    exportPaymentExcel

);

// Seat Excel
router.get(

    "/seat/excel",

    authMiddleware,

    adminMiddleware,

    exportSeatExcel

);

export default router;