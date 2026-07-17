import Attendance from "../models/Attendance.js";
import moment from "moment";
import Seat from "../models/Seat.js";
import { validateGPS } from "../utils/gpsValidator.js";

export const markEntry = async (req, res) => {
    try {

        const {
            verificationMethod,
            latitude,
            longitude
        } = req.body;

        const studentId = req.user.id;

        // Validate verification method
        if (!verificationMethod) {
            return res.status(400).json({
                success: false,
                message: "Verification method is required."
            });
        }

        // GPS Verification
        if (verificationMethod === "gps") {

            if (
                latitude === undefined ||
                longitude === undefined
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Latitude and Longitude are required."
                });
            }

            const gpsResult = validateGPS(
                Number(process.env.LIBRARY_LATITUDE),
                Number(process.env.LIBRARY_LONGITUDE),
                Number(latitude),
                Number(longitude),
                Number(process.env.ALLOWED_RADIUS)
            );

            if (!gpsResult.isValid) {
                return res.status(400).json({
                    success: false,
                    message: `You are ${Math.round(gpsResult.distance)} meters away from the library. Please come within ${process.env.ALLOWED_RADIUS} meters.`
                });
            }
        }

        const today = moment().startOf("day").toDate();

        const alreadyMarked = await Attendance.findOne({
            student: studentId,
            attendanceDate: today
        });

        if (alreadyMarked) {
            return res.status(400).json({
                success: false,
                message: "Entry already marked."
            });
        }

        // const seat = await Seat.findOne({
        //     student: studentId
        // });

        // if (!seat) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "No seat allotted."
        //     });
        // }

        const attendance = await Attendance.create({
            student: studentId,
            // seat: seat._id,
            attendanceDate: today,
            date: moment().format("YYYY-MM-DD"),
            entryTime: new Date(),
            verificationMethod,
            verification: {
                method: verificationMethod,
                latitude: latitude || null,
                longitude: longitude || null
            },
            status: "inside"
        });

        res.status(201).json({
            success: true,
            message: "Entry marked successfully.",
            attendance
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const markExit=async(req,res)=>{
    try {
        const studentId=req.user.id;
        const today=moment().startOf("day").toDate();
        
        const attendance=await Attendance.findOne({
            student:studentId,
            attendanceDate:today,
            // status:"inside"
        });

        if(!attendance){
            return res.status(404).json({
                success:false,
                message:"Please mark entry first"
            });
        }
        if(attendance.exitTime){
            return res.status(400).json({
                success:false,
                message:"Exit already marked."
            });
        }
        attendance.exitTime=new Date();
        attendance.status="completed";
        // attendance.status="outside"
        await attendance.save();
        res.status(200).json({
            success:true,
            message:"Exit Marked Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};


export const getTodayAttendance=async(req,res)=>{
    try {
        const today=moment().startOf("day").toDate();
        const attendance=await Attendance.find({
            attendanceDate:today
        }).populate(
            "student",
            "fullName"
        ).populate(
            "seat","seatNumber"
        );

        res.status(200).json({
            success:true,
            attendance
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

export const studentsInside =
    async (req, res) => {

    try {

        const students =
            await Attendance.find({
                status: "inside"
            }).populate(
                "student",
                "fullName email"
            ).populate("seat","seatNumber");

        res.status(200).json({
            success: true,
            total:students.length,
            students
        });

    } catch (error) {

        res.status(500).json({
            success:false,
            message: error.message
        });
    }
};

export const myAttendance=async(req,res)=>{
    try {
        const history=await Attendance.find({
            student:req.user.id
        }).populate("seat","seatNumber category floor").sort({
            attendanceDate:-1
        });
        res.status(200).json({
            success:true,
            history
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}