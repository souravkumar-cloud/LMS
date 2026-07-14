import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Seat from "../models/Seat.js";
import Subscription from "../models/Subscription.js";
import payment from "../models/Payment.js";
import Attendance from "../models/Attendance.js";
import Payment from "../models/Payment.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";

export const addStudent = async (req, res) => {

    try {

        const { fullName, email, phone, aadhaar, password, seatId, gender, emergencyContact, paymentMethod, planId } = req.body;
        if (!fullName || !email || !phone || !aadhaar || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }
        const existingUser = await User.findOne({
            $or: [
                { email },
                { phone },
                { aadhaar }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists."
                })
            }
            if (existingUser.phone === phone) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number already exists."
                })
            }
            if (existingUser.aadhaar === aadhaar) {
                return res.status(400).json({
                    success: false,
                    message: "aadhaar already exists."
                })
            }
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await User.create({
            fullName,
            email,
            phone,
            aadhaar,
            password: hashedPassword,
            seatId,
            role: "student",

            gender: req.body.gender,
            address: req.body.address,
            // seatId:req.body.seatId,
            emergencyContact: req.body.emergencyContact,
            paymentMethod,
            planId,

            profilePhoto: req.file ? req.file.path : ""
        });
        const plan = await SubscriptionPlan.findById(planId);
        console.log(plan);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Subscription plan not found"
            });
        }

        if (!plan.durationInDays || plan.durationInDays <= 0) {
            return res.status(400).json({
                success: false,
                message: "Subscription plan duration is invalid"
            });
        }

        const startDate = new Date();

        const endDate = new Date(startDate);

        endDate.setDate(
            endDate.getDate() + Number(plan.durationInDays)
        );

        const subscription = await Subscription.create({

            student: student._id,

            plan: plan._id,

            startDate,

            endDate,

            status: "active"

        });

        console.log("Subscription Created", subscription)

        await Payment.create({

            student: student._id,

            plan: plan._id,

            subscription: subscription._id, // Use the same field name as your schema

            amount: plan.price,

            paymentMethod,

            paymentType: "new-admission",

            paymentStatus: "paid",

            receiptNumber: `RCPT-${Date.now()}`,

            paidAt: new Date()

        });

        console.log("Payment created",payment)

        if (seatId) {
            const seat = await Seat.findById(seatId);

            if (!seat) {
                return res.status(404).json({
                    success: false,
                    message: "Seat not found"
                });
            }

            if (seat.status === "occupied") {
                return res.status(400).json({
                    success: false,
                    message: "Seat is already occupied"
                });
            }

            seat.student = student._id;
            seat.status = "occupied";

            await seat.save();

            student.seatId = seatId;


            await student.save();
        }

        res.status(201).json({
            success: true,
            message: "Student Added Successfully",
            student
        })
    } catch (error) {
        console.error("Add Student Error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack
        })
    }
};

export const getAllStudents = async (req, res) => {

    try {

        const users = await User.find({
            role: { $in: ["student", "admin"] }
        })
            .select("-password");
        // .populate("SeatNumber");

        const usersWithSeat = await Promise.all(

            users.map(async (user) => {

                const seat = await Seat.findOne({
                    student: user._id
                });

                return {
                    ...user.toObject(),
                    seat
                };

            })

        );

        res.status(200).json({

            success: true,

            students: usersWithSeat

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


export const getStudentById = async (req, res) => {

    try {

        const student = await User.findById(req.params.id)
            .select("-password");

        if (!student) {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        const seat = await Seat.findOne({
            student: student._id
        });

        const subscription = await Subscription.findOne({
            student: student._id,
            status: "active"
        }).populate("plan");

        const attendanceCount = await Attendance.countDocuments({
            student: student._id
        });

        const paymentCount = await Payment.countDocuments({
            student: student._id
        })

        res.status(200).json({

            success: true,

            student: {

                ...student.toObject(),

                seat,

                subscription,

                attendanceCount,

                paymentCount

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const updateStudent = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            fullName,
            email,
            phone,
            aadhaar,
            gender,
            address,
            city,
            state,
            pinCode,
            guardianName,
            guardianPhone,
            emergencyContact,
            seatId
        } = req.body;

        const student = await User.findById(id);

        if (!student || student.role !== "student") {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        // -----------------------
        // Update Student Details
        // -----------------------

        student.fullName = fullName || student.fullName;
        student.email = email || student.email;
        student.phone = phone || student.phone;
        student.aadhaar = aadhaar || student.aadhaar;
        student.gender = gender || student.gender;
        student.address = address || student.address;
        student.city = city || student.city;
        student.state = state || student.state;
        student.pinCode = pinCode || student.pinCode;
        student.guardianName = guardianName || student.guardianName;
        student.guardianPhone = guardianPhone || student.guardianPhone;
        student.emergencyContact =
            emergencyContact || student.emergencyContact;

        // If using multer/cloudinary
        if (req.file) {

            student.profilePhoto = req.file.path;

        }

        await student.save();

        // -----------------------
        // Seat Update
        // -----------------------

        if (seatId) {

            // Current seat of student
            const oldSeat = await Seat.findOne({
                student: student._id
            });

            // If seat changed
            if (
                !oldSeat ||
                oldSeat._id.toString() !== seatId
            ) {

                if (oldSeat) {

                    oldSeat.student = null;
                    oldSeat.status = "available";

                    await oldSeat.save();

                }

                const newSeat = await Seat.findById(seatId);

                if (!newSeat) {

                    return res.status(404).json({
                        success: false,
                        message: "Seat not found"
                    });

                }

                if (newSeat.status === "occupied") {

                    return res.status(400).json({
                        success: false,
                        message: "Seat already occupied"
                    });

                }

                newSeat.student = student._id;
                newSeat.status = "occupied";

                await newSeat.save();

            }

        }

        res.status(200).json({

            success: true,
            message: "Student Updated Successfully",
            student

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

export const toggleStudentStatus = async (req, res) => {
    try {

        const { id } = req.params;

        const student = await User.findById(id);

        if (!student || student.role !== "student") {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        student.isActive = !student.isActive;

        // If deactivating the student
        if (!student.isActive) {

            const seat = await Seat.findOne({
                student: student._id
            });

            if (seat) {

                seat.student = null;
                seat.status = "available";

                await seat.save();

            }

            // Remove seat from student
            student.seatId = null;

        }

        await student.save();

        res.status(200).json({
            success: true,
            message: `Student ${student.isActive ? "Activated" : "Deactivated"} Successfully`,
            student
        });

    } catch (error) {

        console.error("Toggle Student Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const searchStudent = async (req, res) => {
    try {
        const { name } = req.query;
        const students = await User.find({
            role: "student",
            $or: [
                {
                    fullName: {
                        $regex: name,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: name,
                        $options: "i"
                    }
                }, {
                    phone: {
                        $regex: name,
                        $options: "i"
                    }
                }
            ]
        }).select("-password");
        res.status(200).json({
            success: true,
            total: students.length,
            students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getStudentsWithPagination = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const totalStudents = await User.countDocuments({

            role: "student"

        });

        const students = await User.find({

            role: "student"

        })

            .select("-password")

            .skip(skip)

            .limit(limit)

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            currentPage: page,

            totalPages: Math.ceil(totalStudents / limit),

            totalStudents,

            students

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
=================================================
Filter Students
=================================================
*/

export const filterStudents = async (req, res) => {

    try {

        const { status } = req.query;

        const students = await User.find({

            role: "student",

            isActive: true

        })

            .select("-password");

        res.status(200).json({

            success: true,

            students

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};