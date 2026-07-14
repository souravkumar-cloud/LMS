import express from "express";

import {

    adminDashboard,

    studentDashboard

} from "../controllers/dashboardController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

/*
====================================================
Admin Dashboard
====================================================
*/

router.get(

    "/admin",

    authMiddleware,

    adminMiddleware,

    adminDashboard

);

/*
====================================================
Student Dashboard
====================================================
*/

router.get(

    "/student",

    authMiddleware,

    studentDashboard

);

export default router;