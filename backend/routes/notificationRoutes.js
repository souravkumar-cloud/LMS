import express from "express";

import {
    createNotification,
    broadcastNotification,
    myNotifications,
    unreadCount,
    markAsRead,
    deleteNotification
} from "../controllers/notificationController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

/*
=========================================================
ADMIN ROUTES
=========================================================
*/

// Create Personal Notification
router.post(
    "/create",
    authMiddleware,
    adminMiddleware,
    createNotification
);

// Broadcast Notification
router.post(
    "/broadcast",
    authMiddleware,
    adminMiddleware,
    broadcastNotification
);

// Delete Any Notification
router.delete(
    "/admin/:id",
    authMiddleware,
    adminMiddleware,
    deleteNotification
);

/*
=========================================================
STUDENT ROUTES
=========================================================
*/

// My Notifications
router.get(
    "/my",
    authMiddleware,
    myNotifications
);

// Unread Count
router.get(
    "/unread-count",
    authMiddleware,
    unreadCount
);

// Mark As Read
router.put(
    "/read/:id",
    authMiddleware,
    markAsRead
);

// Delete Own Notification
router.delete(
    "/:id",
    authMiddleware,
    deleteNotification
);

export default router;