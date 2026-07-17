import Attendance from "../models/Attendance.js";
import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import Seat from "../models/Seat.js";
import User from "../models/User.js";
import exportExcel from "../utils/exportExcel.js";
import generatePDFReport from "../utils/generatePDFReport.js";
import moment from "moment";

export const exportAttendanceExcel = async (req, res) => {
    try {
        const { today } = req.query;
        let query = {};
        if (today === "true") {
            const todayStart = moment().startOf("day").toDate();
            query.attendanceDate = todayStart;
        }

        const attendance = await Attendance.find(query)
            .populate("student", "fullName");

        if (!attendance || attendance.length === 0) {
            return res.status(404).json({ success: false, message: "No attendance records found to export." });
        }

        // Fetch all allocated seats to construct a mapping of student ID to seat number
        const seats = await Seat.find({ student: { $ne: null } });
        const studentSeatMap = {};
        seats.forEach(seat => {
            if (seat.student) {
                studentSeatMap[seat.student.toString()] = seat.seatNumber;
            }
        });

        const rows = attendance.map(item => ({
            Student: item.student?.fullName || "—",
            Seat: item.student ? (studentSeatMap[item.student._id.toString()] || "—") : "—",
            Entry: item.entryTime ? moment(item.entryTime).format("YYYY-MM-DD hh:mm A") : "—",
            Exit: item.exitTime ? moment(item.exitTime).format("YYYY-MM-DD hh:mm A") : "—"
        }));

        await exportExcel({
            fileName: today === "true" ? "TodayAttendance" : "Attendance",
            sheetName: "Attendance",
            columns: [
                { header: "Student", key: "Student" },
                { header: "Seat", key: "Seat" },
                { header: "Entry Time", key: "Entry" },
                { header: "Exit Time", key: "Exit" }
            ],
            rows,
            res
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const exportPaymentExcel = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("student", "fullName")
            .populate("plan", "name");

        if (!payments || payments.length === 0) {
            return res.status(404).json({ success: false, message: "No payment records found to export." });
        }

        const rows = payments.map(payment => ({
            Receipt: payment.receiptNumber,
            Student: payment.student?.fullName || "—",
            Amount: payment.amount,
            Method: payment.paymentMethod,
            Status: payment.paymentStatus || payment.status
        }));

        await exportExcel({
            fileName: "Payments",
            sheetName: "Payments",
            columns: [
                { header: "Receipt", key: "Receipt" },
                { header: "Student", key: "Student" },
                { header: "Amount", key: "Amount" },
                { header: "Method", key: "Method" },
                { header: "Status", key: "Status" }
            ],
            rows,
            res
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const exportSeatExcel = async (req, res) => {
    try {
        const seats = await Seat.find().populate("student", "fullName");

        if (!seats || seats.length === 0) {
            return res.status(404).json({ success: false, message: "No seat records found to export." });
        }

        const rows = seats.map(seat => ({
            Seat: seat.seatNumber,
            Floor: seat.floor,
            Category: seat.category,
            Status: seat.status,
            Student: seat.student?.fullName || "—"
        }));

        await exportExcel({
            fileName: "Seats",
            sheetName: "Seats",
            columns: [
                { header: "Seat", key: "Seat" },
                { header: "Floor", key: "Floor" },
                { header: "Category", key: "Category" },
                { header: "Status", key: "Status" },
                { header: "Student", key: "Student" }
            ],
            rows,
            res
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const exportStudentExcel = async (req, res) => {
    try {
        const { role } = req.query;
        const targetRole = role === "admin" ? "admin" : "student";

        const users = await User.find({ role: targetRole });

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: `No ${targetRole === "admin" ? "admins" : "students"} found to export.` });
        }

        const rows = users.map(user => ({
            Name: user.fullName,
            Email: user.email,
            Phone: user.phone,
            Aadhaar: user.aadhaar,
            Status: user.isActive ? "Active" : "Inactive"
        }));

        await exportExcel({
            fileName: targetRole === "admin" ? "Admins" : "Students",
            sheetName: targetRole === "admin" ? "Admins" : "Students",
            columns: [
                { header: "Name", key: "Name" },
                { header: "Email", key: "Email" },
                { header: "Phone", key: "Phone" },
                { header: "Aadhaar", key: "Aadhaar" },
                { header: "Status", key: "Status" }
            ],
            rows,
            res
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const generateReport = async (req, res) => {
    try {
        const { type, from, to } = req.query;
        switch (type) {
            case "attendance":
                return attendanceReport(req, res, from, to);
            case "payment":
                return paymentReport(req, res, from, to);
            case "seat":
                return seatReport(req, res);
            case "student":
                return studentReport(req, res);
            case "subscription":
                return subscriptionReport(req, res, from, to);
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid Report Type"
                });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const attendanceReport = async (req, res, from, to) => {
    try {
        const query = {};
        if (from && to) {
            query.attendanceDate = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }
        const report = await Attendance.find(query)
            .populate("student", "fullName email")
            .populate("seat", "seatNumber")
            .sort({ attendanceDate: -1 });

        if (!report || report.length === 0) {
            return res.status(404).json({ success: false, message: "No attendance records found for the specified criteria." });
        }

        const columns = ["Student", "Email", "Seat", "Date", "Entry Time", "Exit Time"];
        const rows = report.map(item => ({
            Student: item.student?.fullName || "—",
            Email: item.student?.email || "—",
            Seat: item.seat?.seatNumber || "—",
            Date: item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString() : "—",
            Entry: item.entryTime || "—",
            Exit: item.exitTime || "—"
        }));

        generatePDFReport("Attendance Report", columns, rows, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const paymentReport = async (req, res, from, to) => {
    try {
        const query = {};
        if (from && to) {
            query.paidAt = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }
        query.paymentStatus = "paid";
        const report = await Payment.find(query)
            .populate("student", "fullName")
            .populate("plan", "name")
            .sort({ paidAt: -1 });

        if (!report || report.length === 0) {
            return res.status(404).json({ success: false, message: "No payment records found for the specified criteria." });
        }

        const columns = ["Receipt No", "Student", "Plan", "Amount", "Method", "Date"];
        const rows = report.map(payment => ({
            Receipt: payment.receiptNumber || "—",
            Student: payment.student?.fullName || "—",
            Plan: payment.plan?.name || "—",
            Amount: `₹${payment.amount}`,
            Method: payment.paymentMethod || "—",
            Date: payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "—"
        }));

        generatePDFReport("Payment Report", columns, rows, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const seatReport = async (req, res) => {
    try {
        const seats = await Seat.find()
            .populate("student", "fullName")
            .sort({ seatNumber: 1 });

        if (!seats || seats.length === 0) {
            return res.status(404).json({ success: false, message: "No seat records found to export." });
        }

        const columns = ["Seat No", "Floor", "Category", "Status", "Student"];
        const rows = seats.map(seat => ({
            Seat: seat.seatNumber || "—",
            Floor: seat.floor || "—",
            Category: seat.category || "—",
            Status: seat.status || "—",
            Student: seat.student?.fullName || "—"
        }));

        generatePDFReport("Seat Report", columns, rows, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const studentReport = async (req, res) => {
    try {
        const { role } = req.query;
        const targetRole = role === "admin" ? "admin" : "student";
        const users = await User.find({ role: targetRole })
            .select("-password")
            .sort({ fullName: 1 });

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: `No ${targetRole === "admin" ? "admins" : "students"} found to export.` });
        }

        const columns = ["Name", "Email", "Phone", "Aadhaar", "Status"];
        const rows = users.map(user => ({
            Name: user.fullName,
            Email: user.email,
            Phone: user.phone,
            Aadhaar: user.aadhaar,
            Status: user.isActive ? "Active" : "Inactive"
        }));

        const title = targetRole === "admin" ? "Administrators Report" : "Student Report";
        generatePDFReport(title, columns, rows, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const subscriptionReport = async (req, res, from, to) => {
    try {
        const query = {};
        if (from && to) {
            query.createdAt = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }
        const report = await Subscription.find(query)
            .populate("student", "fullName")
            .populate("plan", "name")
            .sort({ createdAt: -1 });

        if (!report || report.length === 0) {
            return res.status(404).json({ success: false, message: "No subscription records found for the specified criteria." });
        }

        const columns = ["Student", "Plan", "Status", "Created At"];
        const rows = report.map(sub => ({
            Student: sub.student?.fullName || "—",
            Plan: sub.plan?.name || "—",
            Status: sub.status || "—",
            Date: sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "—"
        }));

        generatePDFReport("Subscription Report", columns, rows, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};