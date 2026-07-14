import Attendance from "../models/Attendance.js";
import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import Seat from "../models/Seat.js";
import User from "../models/User.js";
import exportExcel from "../utils/exportExcel.js";


export const exportAttendanceExcel = async (req, res) => {

    const attendance = await Attendance.find()

        .populate("student", "fullname")

        .populate("seat", "seatNumber");

    const rows = attendance.map(item => ({
        Student: item.student?.fullname,
        Seat: item.seat?.seatNumber,
        Entry: item.entryTime,
        Exit: item.exitTime
    }));

    await exportExcel({

        fileName: "Attendance",

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

};

export const exportPaymentExcel = async (req, res) => {

    const payments = await Payment.find()

        .populate("student", "fullname")

        .populate("plan", "name");

    const rows = payments.map(payment => ({
        Receipt: payment.receiptNumber,
        Student: payment.student?.fullname,
        Amount: payment.amount,
        Method: payment.paymentMethod,
        Status: payment.status
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

};

export const exportSeatExcel = async (req, res) => {

    const seats = await Seat.find();

    const rows = seats.map(seat => ({
        Seat: seat.seatNumber,
        Floor: seat.floor,
        Category: seat.category,
        Status: seat.status
    }));

    await exportExcel({

        fileName: "Seats",

        sheetName: "Seats",

        columns: [

            { header: "Seat", key: "Seat" },

            { header: "Floor", key: "Floor" },

            { header: "Category", key: "Category" },

            { header: "Status", key: "Status" }

        ],

        rows,

        res

    });

};

export const exportStudentExcel = async (req, res) => {

    try {

        const students = await User.find({

            role: "student"

        });

        const rows = students.map(student => ({

            Name: student.fullname,

            Email: student.email,

            Phone: student.phone,

            Aadhaar: student.aadhaar,

            Status: student.isActive

                ? "Active"

                : "Inactive"

        }));

        await exportExcel({

            fileName: "Students",

            sheetName: "Students",

            columns: [

                {

                    header: "Name",

                    key: "Name"

                },

                {

                    header: "Email",

                    key: "Email"

                },

                {

                    header: "Phone",

                    key: "Phone"

                },

                {

                    header: "Aadhaar",

                    key: "Aadhaar"

                },

                {

                    header: "Status",

                    key: "Status"

                }

            ],

            rows,

            res

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


export const generateReport = async (req, res) => {

    try {

        const {

            type,

            from,

            to

        } = req.query;

        switch (type) {

            case "attendance":

                return attendanceReport(

                    req,

                    res,

                    from,

                    to

                );

            case "payment":

                return paymentReport(

                    req,

                    res,

                    from,

                    to

                );

            case "seat":

                return seatReport(

                    req,

                    res

                );

            case "student":

                return studentReport(

                    req,

                    res

                );

            case "subscription":

                return subscriptionReport(

                    req,

                    res,

                    from,

                    to

                );

            default:

                return res.status(400).json({

                    success:false,

                    message:"Invalid Report Type"

                });

        }

    }

    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

const attendanceReport = async (

    req,

    res,

    from,

    to

)=>{

    const report = await Attendance.find({

        attendanceDate:{

            $gte:new Date(from),

            $lte:new Date(to)

        }

    })

    .populate(

        "student",

        "fullName email"

    )

    .populate(

        "seat",

        "seatNumber"

    )

    .sort({

        attendanceDate:-1

    });

    return res.status(200).json({

        success:true,

        total:report.length,

        report

    });

};

const paymentReport = async (

    req,

    res,

    from,

    to

)=>{

    const report = await Payment.find({

        paidAt:{

            $gte:new Date(from),

            $lte:new Date(to)

        },

        status:"success"

    })

    .populate(

        "student",

        "fullName"

    )

    .populate(

        "plan",

        "name"

    )

    .sort({

        paidAt:-1

    });

    return res.status(200).json({

        success:true,

        total:report.length,

        report

    });

};

const seatReport = async (

    req,

    res

)=>{

    const seats = await Seat.find()

    .populate(

        "student",

        "fullName"

    )

    .sort({

        seatNumber:1

    });

    return res.status(200).json({

        success:true,

        total:seats.length,

        seats

    });

};
const studentReport = async (

    req,

    res

)=>{

    const students = await User.find({

        role:"student"

    })

    .select(

        "-password"

    )

    .sort({

        fullname:1

    });

    return res.status(200).json({

        success:true,

        total:students.length,

        students

    });

};

const subscriptionReport = async (

    req,

    res,

    from,

    to

)=>{

    const report = await Subscription.find({

        createdAt:{

            $gte:new Date(from),

            $lte:new Date(to)

        }

    })

    .populate(

        "student",

        "fullName"

    )

    .populate(

        "plan",

        "name"

    )

    .sort({

        createdAt:-1

    });

    return res.status(200).json({

        success:true,

        total:report.length,

        report

    });

};