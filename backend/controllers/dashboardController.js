import User from "../models/User.js";
import Seat from "../models/Seat.js";
import SeatRequest from "../models/SeatRequest.js";
import Attendance from "../models/Attendance.js";
import Subscription from "../models/Subscription.js";
import Payment from "../models/Payment.js";
import Notification from "../models/Notification.js";


export const adminDashboard = async (req, res) => {

    try {

        const today = new Date();

        today.setHours(0,0,0,0);

        const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        const [

            totalStudents,

            activeStudents,

            totalSeats,

            occupiedSeats,

            availableSeats,

            pendingRequests,

            todayAttendance,

            studentsInside,

            expiringSubscriptions,

            recentPayments,

            recentNotifications,

            todayRevenue,

            monthlyRevenue

        ] = await Promise.all([

            User.countDocuments({

                role:"student"

            }),

            User.countDocuments({

                role:"student",

                isActive:true

            }),

            Seat.countDocuments(),

            Seat.countDocuments({

                status:"occupied"

            }),

            Seat.countDocuments({

                status:"available"

            }),

            SeatRequest.countDocuments({

                status:"pending-approval"

            }),

            Attendance.countDocuments({

                attendanceDate:today

            }),

            Attendance.countDocuments({

                status:"inside"

            }),

            Subscription.countDocuments({

                status:"active",

                endDate:{

                    $lte:new Date(

                        Date.now() +

                        5*24*60*60*1000

                    )

                }

            }),

            Payment.find()

            .sort({

                paidAt:-1

            })

            .limit(5),

            Notification.find()

            .sort({

                createdAt:-1

            })

            .limit(5),

            Payment.aggregate([

                {

                    $match:{

                        paidAt:{

                            $gte:today

                        },

                        paymentStatus:"paid"

                    }

                },

                {

                    $group:{

                        _id:null,

                        total:{

                            $sum:"$amount"

                        }

                    }

                }

            ]),

            Payment.aggregate([

                {

                    $match:{

                        paidAt:{

                            $gte:firstDayOfMonth

                        },

                        paymentStatus:"paid"

                    }

                },

                {

                    $group:{

                        _id:null,

                        total:{

                            $sum:"$amount"

                        }

                    }

                }

            ])

        ]);

        return res.status(200).json({

            success:true,

            dashboard:{

                totalStudents,

                activeStudents,

                totalSeats,

                occupiedSeats,

                availableSeats,

                pendingRequests,

                todayAttendance,

                studentsInside,

                expiringSubscriptions,

                todayRevenue:

                todayRevenue[0]?.total || 0,

                monthlyRevenue:

                monthlyRevenue[0]?.total || 0,

                recentPayments,

                recentNotifications

            }

        });

    }

    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

export const studentDashboard = async (req, res) => {

    try {

        const studentId = req.user.id;

        const today = new Date();
        today.setHours(0,0,0,0);

        const [
            user,
            seat,
            subscription,
            todayAttendance,
            attendanceHistory,
            recentPayments,
            notifications,
            pendingRequest
        ] = await Promise.all([

            User.findById(studentId).select("-password"),

            Seat.findOne({
                student: studentId
            }),

            Subscription.findOne({
                student: studentId,
                status: "active"
            }).populate("plan"),

            Attendance.findOne({
                student: studentId,
                attendanceDate: today
            }),

            Attendance.find({
                student: studentId
            })
            .select("attendanceDate status")
            .sort({ attendanceDate: 1 }),

            Payment.find({
                student: studentId
            })
            .sort({ paidAt: -1 })
            .limit(5),

            Notification.find({
                recipient: studentId
            })
            .sort({ createdAt: -1 })
            .limit(5),

            SeatRequest.findOne({
                student: studentId,
                status: "pending-approval"
            })

        ]);

        res.status(200).json({

            success: true,

            dashboard: {

                user,

                seat,

                subscription,

                todayAttendance,

                attendanceHistory,

                recentPayments,

                notifications,

                pendingRequest

            }

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};