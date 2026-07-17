import express from "express";
import {
    getMyProfile,
    updateProfile,
    profileSummary
} from "../controllers/profileController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Both Admin & Student
router.get("/", authMiddleware, getMyProfile);

router.put("/update", authMiddleware, updateProfile);

router.get("/summary", authMiddleware, profileSummary);

export default router;