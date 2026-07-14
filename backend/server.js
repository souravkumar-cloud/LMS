import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import multer from "multer";

import connectDB from "./config/db.js";
import { initializeSocket } from "./socket/socket.js";

import subscriptionExpiryJob from "./jobs/subscriptionExpiryJob.js";
import deleteExpiredNotifications from "./jobs/deleteExpiredNotifications.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import subscriptionPlanRoutes from "./routes/subscriptionPlanRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import librarySettingRoutes from "./routes/librarySettingRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";

dotenv.config();

const app = express();

/*
=====================================================
Database Connection
=====================================================
*/
connectDB();

/*
=====================================================
Cron Jobs
=====================================================
*/
subscriptionExpiryJob();
deleteExpiredNotifications();

/*
=====================================================
Middlewares
=====================================================
*/
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/*
=====================================================
API Routes
=====================================================
*/
app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/subscription", subscriptionRoutes);

app.use("/api/subscription-plan", subscriptionPlanRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/seat", seatRoutes);

app.use("/api/qr", qrRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/notification", notificationRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/report", reportRoutes);

app.use("/api/library-settings", librarySettingRoutes);

app.use("/api/audit-log", auditLogRoutes);


/*
=====================================================
Home Route
=====================================================
*/
app.get("/", (req, res) => {
    res.send("Library Management System API Running...");
});

/*
=====================================================
Global Error Handler
=====================================================
*/
app.use((err, req, res, next) => {

    console.error("========== SERVER ERROR ==========");
    console.error(err);
    console.error("==================================");

    // Multer Errors
    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {

            return res.status(400).json({
                success: false,
                message: "Image size must be less than 5 MB."
            });

        }

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

    // Invalid File Type
    if (err.message === "Only image files are allowed") {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

    // Default Error
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

});

/*
=====================================================
Socket.io
=====================================================
*/
const server = http.createServer(app);

initializeSocket(server);

/*
=====================================================
Start Server
=====================================================
*/
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log("==================================");
    console.log(`🚀 Server Running On Port ${PORT}`);
    console.log("==================================");

});