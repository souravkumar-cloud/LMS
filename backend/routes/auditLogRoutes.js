import express from "express";

import {

    getAuditLogs,

    filterAuditLogs

} from "../controllers/auditLogController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get(

    "/",

    authMiddleware,

    adminMiddleware,

    getAuditLogs

);

router.get(

    "/filter",

    authMiddleware,

    adminMiddleware,

    filterAuditLogs

);

export default router;