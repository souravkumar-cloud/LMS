import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { getIO } from "../socket/socket.js";

/*
=========================================================
Create Personal Notification (Admin)
=========================================================
*/
export const createNotification = async (req, res) => {

    try {

        const {
            recipient,
            title,
            message,
            type,
            priority,
            actionUrl
        } = req.body;

        const student = await User.findById(recipient);

        if (!student || student.role !== "student") {

            return res.status(404).json({
                success: false,
                message: "Student not found."
            });

        }

        const notification = await Notification.create({

            recipient,
            title,
            message,
            type:type || "announcement",
            priority: priority || "low",
            actionUrl:actionUrl || "",

            // Personal notification expires after 2 days
            expiresAt: new Date(
                Date.now() + 2 * 24 * 60 * 60 * 1000
            ),

            createdBy: req.user.id

        });

        getIO()
            .to(recipient.toString())
            .emit("notification", notification);

        res.status(201).json({

            success: true,
            message: "Notification sent successfully.",
            notification

        });

    }

    catch (error) {
        console.log("Create Notification Error:",error);
        res.status(500).json({

            success: false,
            message: error.message,
            stack:error.stack

        });

    }

};

/*
=========================================================
Broadcast Notification
=========================================================
*/

export const broadcastNotification = async (req, res) => {

    try {

        const {

            title,
            message,
            priority,
            actionUrl,
            expiresAt

        } = req.body;

        const students = await User.find({

            role: "student",
            isActive: true

        });

        const notifications = students.map(student => ({

            recipient: student._id,

            title,
            message,

            type: "announcement",

            priority,

            actionUrl,

            expiresAt,

            isBroadcast: true,

            createdBy: req.user.id

        }));

        const savedNotifications = await Notification.insertMany(
            notifications
        );

        students.forEach((student, index) => {

            getIO()
                .to(student._id.toString())
                .emit(
                    "notification",
                    savedNotifications[index]
                );

        });

        res.status(201).json({

            success: true,

            message: `Broadcast sent to ${students.length} students.`

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

/*
=========================================================
Student Notifications
=========================================================
*/

export const myNotifications = async (req, res) => {

    try {

        const notifications = await Notification.find({

            recipient: req.user.id

        })

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            total: notifications.length,

            notifications

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
=========================================================
Unread Count
=========================================================
*/

export const unreadCount = async (req, res) => {

    try {

        const count = await Notification.countDocuments({

            recipient: req.user.id,

            isRead: false

        });

        res.status(200).json({

            success: true,

            unread: count

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
=========================================================
Mark As Read
=========================================================
*/

export const markAsRead = async (req, res) => {

    try {

        const notification = await Notification.findById(
            req.params.id
        );

        if (!notification) {

            return res.status(404).json({

                success: false,

                message: "Notification not found."

            });

        }

        if (
            notification.recipient.toString() !== req.user.id
        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized"

            });

        }

        if (notification.adminOnly && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "This notification can only be deleted by the admin."
            });
        }

        await Notification.findByIdAndDelete(req.params.id);

        res.status(200).json({

            success: true,

            message: "Notification deleted automatically."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
=========================================================
Delete Notification
=========================================================
*/

export const deleteNotification = async (req, res) => {

    try {

        const notification = await Notification.findById(
            req.params.id
        );

        if (!notification) {

            return res.status(404).json({

                success: false,

                message: "Notification not found."

            });

        }

        console.log(notification.recipient.toString());
console.log(req.user.id);
console.log(notification.recipient.toString() === req.user.id);
        /*
        =========================================
        Admin can delete ANY notification
        =========================================
        */

        if (req.user.role === "admin") {

            await notification.deleteOne();

            return res.status(200).json({

                success: true,

                message: "Notification deleted successfully."

            });

        }

        if (notification.adminOnly && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "This notification can only be deleted by the admin."
            });
        }

        /*
        =========================================
        Student can delete only own notification
        =========================================
        */

        if (
            !notification.recipient.equals(req.user.id)
        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized"

            });

        }

        await notification.deleteOne();

        res.status(200).json({

            success: true,

            message: "Notification deleted successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const sendToAdmin = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        const admins = await User.find({ role: "admin" });
        if (admins.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No admins found to receive the message."
            });
        }

        const notifications = [];
        for (const admin of admins) {
            const notification = await Notification.create({
                title: `Message from ${req.user.fullName}`,
                message,
                type: "system",
                recipient: admin._id,
                createdBy: req.user.id
            });
            notifications.push(notification);

            // Emit to each admin
            getIO().to(admin._id.toString()).emit("notification", notification);
            getIO().to(admin._id.toString()).emit("newNotification", notification);
        }

        res.status(201).json({
            success: true,
            message: "Message sent to admin successfully.",
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};