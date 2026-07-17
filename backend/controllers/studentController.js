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
            planId
        });
        const plan = await SubscriptionPlan.findById(planId);
        console.log(plan);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Subscription plan not found"
            });
        }

        if (plan.category === "not fixed") {
            if (seatId) {
                return res.status(400).json({
                    success: false,
                    message: "A seat cannot be assigned to a 'not fixed' subscription plan."
                });
            }
        } else {
            if (!seatId) {
                return res.status(400).json({
                    success: false,
                    message: "A seat must be assigned for a 'regular' or 'premium' subscription plan."
                });
            }
        }

        if (!plan.durationInDays || plan.durationInDays <= 0) {
            return res.status(400).json({
                success: false,
                message: "Subscription plan duration is invalid"
            });
        }

        const startDate = new Date();

        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

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

            paymentStatus: paymentMethod === "pending" ? "pending" : "paid",

            receiptNumber: `RCPT-${Date.now()}`,

            paidAt: paymentMethod === "pending" ? null : new Date()

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

        const usersWithDetails = await Promise.all(

            users.map(async (user) => {

                const seat = await Seat.findOne({
                    student: user._id
                });

                const payment = await Payment.findOne({
                    student: user._id
                }).sort({ createdAt: -1 });

                return {
                    ...user.toObject(),
                    seat,
                    paymentStatus: payment ? payment.paymentStatus : "N/A"
                };

            })

        );

        res.status(200).json({

            success: true,

            students: usersWithDetails

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
            seatId,
            planId,
            isActive
        } = req.body;

        const student = await User.findById(id);

        if (!student || student.role !== "student") {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        // -----------------------
        // Plan & Subscription Update
        // -----------------------
        let isHourly = false;
        if (planId) {
            const plan = await SubscriptionPlan.findById(planId);
            if (!plan) {
                return res.status(404).json({
                    success: false,
                    message: "Subscription plan not found."
                });
            }

            isHourly = plan.category === "not fixed" || plan.name?.toLowerCase().includes("hourly");

            // Deactivate any existing active subscriptions for this student
            await Subscription.updateMany(
                { student: student._id, status: "active" },
                { status: "expired" }
            );

            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);

            const subscription = await Subscription.create({
                student: student._id,
                plan: plan._id,
                startDate,
                endDate,
                status: "active"
            });

            // Also create a payment record
            await Payment.create({
                student: student._id,
                plan: plan._id,
                subscription: subscription._id,
                amount: plan.price,
                paymentMethod: "cash",
                paymentType: "subscription-renewal",
                paymentStatus: "paid",
                receiptNumber: `RCPT-${Date.now()}`,
                paidAt: new Date()
            });

            if (isHourly) {
                // If they are hourly, clear seat assignment
                const oldSeat = await Seat.findOne({
                    student: student._id
                });
                if (oldSeat) {
                    oldSeat.student = null;
                    oldSeat.status = "available";
                    await oldSeat.save();
                }
                student.seatId = null;
            }
        }

        // Handle Activation Flag
        if (isActive === "true" || isActive === true) {
            student.isActive = true;
        }

        // Validate Seat assignment on Active status
        if (student.isActive) {
            let checkHourly = isHourly;
            if (!planId) {
                const currentSub = await Subscription.findOne({
                    student: student._id,
                    status: "active"
                }).populate("plan");
                if (currentSub) {
                    checkHourly = currentSub.plan.category === "not fixed" || currentSub.plan.name?.toLowerCase().includes("hourly");
                }
            }

            if (!checkHourly) {
                const finalSeatId = seatId || student.seatId;
                if (!finalSeatId) {
                    return res.status(400).json({
                        success: false,
                        message: "A seat must be assigned for regular or premium subscription plans."
                    });
                }
            }
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

        await student.save();

        // -----------------------
        // Seat Update
        // -----------------------

        if (seatId) {
            const subscription = await Subscription.findOne({
                student: student._id,
                status: "active"
            }).populate("plan");

            if (subscription && subscription.plan.category === "not fixed") {
                return res.status(400).json({
                    success: false,
                    message: "Cannot assign a seat to a student with an hourly/not fixed subscription plan."
                });
            }

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

        // If activating the student
        if (student.isActive) {
            const subscription = await Subscription.findOne({
                student: student._id,
                status: "active"
            }).populate("plan");

            if (subscription) {
                const isHourly = subscription.plan.category === "not fixed" || subscription.plan.name?.toLowerCase().includes("hourly");
                if (!isHourly) {
                    const seat = await Seat.findOne({ student: student._id });
                    if (!seat) {
                        return res.status(400).json({
                            success: false,
                            message: "Cannot activate student. Please assign a seat first for this regular/premium subscription plan."
                        });
                    }
                }
            }
        } else {
            // If deactivating the student
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

/*
=================================================
Delete Student/Admin
=================================================
*/
export const deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Free up any seat allocated to this student
        await Seat.updateMany(
            { student: req.params.id },
            { $set: { student: null, status: "available" } }
        );

        // Delete user
        await student.deleteOne();

        res.status(200).json({
            success: true,
            message: `${student.role === 'admin' ? 'Admin' : 'Student'} deleted successfully.`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};