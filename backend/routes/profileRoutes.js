import express from "express";
import {
    getMyProfile,
    updateProfile,
    profileSummary,
    uploadProfilePhoto
} from "../controllers/profileController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Both Admin & Student
router.get("/", authMiddleware, getMyProfile);

router.put("/update", authMiddleware,upload.single("profilePhoto"), updateProfile);

router.get("/summary", authMiddleware, profileSummary);

router.post(
    "/photo",
    authMiddleware,
    upload.single("profilePhoto"),
    uploadProfilePhoto
);

export default router;