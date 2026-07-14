import SeatRequest from "../models/SeatRequest.js";
import Seat from "../models/Seat.js";
import User from "../models/User.js"


export const requestSeat=async(req,res)=>{
    try {
        const studentId=req.user.id;
        const {seatId,type}=req.body;

        const seat=await Seat.findById(seatId);

        if(!seat){
            return res.status(404).json({
                message:"Seat Not found"
            });
        }

        if(seat.status==="occupied"){
            return res.status(400).json({
                message:"Seat Already Occupied"
            });
        }

        const existingRequest=await SeatRequest.findOne({
            student:studentId,
            status:"Pending"
        });

        if(existingRequest){
            return res.status(400).json({
                message:"You already have a pending request"
            });
        }
        res.status(201).json({
            success:true,
            message:"Seat Request Sent",
            request
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
};


export const getAllRequests=async(req,res)=>{
    try {
        const requests=await SeatRequest.find()
        .populate("student")
        .populate("requestedSeat")
        .populate("currentSeat")

    res.status(200).json({
        success:true,
        requests
    })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
};


export const approveRequest=async(req,res)=>{
    try {
        const {requestId}=req.params;

        const request=await SeatRequest.findById(requestId);

        if(!request){
            return res.status(404).json({
                message:"Request Not Found"
            });
        }
        const seat=await Seat.findById(request.requestSeat);

        if(seat.status==="occupied"){
            return res.status(400).json({
                message:"Seat Already Occupied"
            });
        }

        seat.status="occupied";
        seat.student=request.student;

        await seat.save();

        request.status="approved";

        await seat.save();

        res.status(200).json({
            success:true,
            message:"Request Approved"
        });
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
};

export const getAllSeats=async(req,res)=>{
    try {
        const seats=await Seat.find().populate("student","fullName email phone").sort({seatNumber:1});
        
        res.status(200).json({
            success:true,
            totalSeats:seats.length,
            seats
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

export const vacateSeat=async(req,res)=>{
    try {
        const {seatId}=req.params;
        const seat=await Seat.findById(seatId);
        if(!seat){
            return res.status(404).json({
                message:"Seat Not Found"
            });
        }
        if (seat.status === "available") {
            return res.status(400).json({
                success: false,
                message: "Seat is already available"
            });
        }
        seat.student=null;
        seat.status="available";
        await seat.save();

        res.status(200).json({
            success:true,
            message:"Seat Vacated"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
};

export const deleteSeat=async(req,res)=>{
    try {
        const {seatId}=req.params;
        const seat=await Seat.findById(seatId);
        if(!seat){
            return res.status(404).json({
                message:"Seat Not Found"
            });
        }
        if(seat.status==="occupied"){
            return res.status(400).json({
                message:"Cannot delete occupied seat"
            });
        }
        await seat.deleteOne();
        res.status(200).json({
            success:true,
            messaage:"Seat Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const getMySeat=async(req,res)=>{
    try {
        const studentId=req.user.id;
        const seat=await Seat.findOne({
            student:studentId
        });
        res.status(200).json({
            success:true,
            seat
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
};

export const myRequests=async(req,res)=>{
    try {
        const studentId=req.user.id;
        const requests=await SeatRequest.find({
            student:studentId
        }).populate("requestedSeat")
        .sort({createdAt:-1});

        res.status(200).json({
            success:true,
            requests
        });
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
};

export const addSeat=async(req,res)=>{
    try {
        const {seatNumber,category,floor}=req.body;

        if(!seatNumber || !category){
            return res.status(400).json({
                success:false,
                message:"Seat Number and Category are required."
            });
        }
        const exists=await Seat.findOne({
            seatNumber
        });
        if(exists){
            return res.status(400).json({
                success:false,
                message:"Seat already exists."
            });
        }

        const seat=await Seat.create({
            seatNumber,
            category,
            floor
        });

        res.status(201).json({
            success:true,
            message:"Seat Created Successfully",
            seat
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const getAvailableSeats=async(req,res)=>{
    try {
        const seats=await Seat.find({
            status:"available"
        }).sort({
            seatNumber:1
        });

        res.status(200).json({
            success:true,
            totalAvailable:seats.length,
            seats
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

export const getSeatById = async (req, res) => {

    try {

        const seat = await Seat.findById(req.params.id)
            .populate("student", "fullName email");

        if (!seat) {

            return res.status(404).json({

                success: false,

                message: "Seat not found"

            });

        }

        res.status(200).json({

            success: true,

            seat

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


export const updateSeat = async (req, res) => {

    try {

        const {

            seatNumber,

            floor,

            category,

            status,

            remarks

        } = req.body;

        const seat = await Seat.findById(req.params.id);

        if (!seat) {

            return res.status(404).json({

                success: false,

                message: "Seat not found"

            });

        }

        // Don't allow marking an occupied seat as available
        if (

            seat.student &&

            status === "available"

        ) {

            return res.status(400).json({

                success: false,

                message: "Vacate the student first."

            });

        }

        // Check duplicate seat number
        const duplicate = await Seat.findOne({

            seatNumber,

            _id: { $ne: seat._id }

        });

        if (duplicate) {

            return res.status(400).json({

                success: false,

                message: "Seat Number already exists."

            });

        }

        seat.seatNumber = seatNumber;

        seat.floor = floor;

        seat.category = category;

        seat.status = status;

        seat.remarks = remarks;

        await seat.save();

        res.status(200).json({

            success: true,

            message: "Seat Updated Successfully",

            seat

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// export const getMySeat = async (req, res) => {

//     const seat = await Seat.findOne({

//         student: req.user.id

//     }).populate({

//         path: "subscription",

//         populate: {

//             path: "plan"

//         }

//     });

//     if (!seat) {

//         return res.status(404).json({

//             success: false,

//             message: "No seat assigned."

//         });

//     }

//     res.json({

//         success: true,

//         seat

//     });

// };

export const getSeatMasterData = async (req, res) => {

    try {

        const floors = await Seat.distinct("floor");

        const categories = await Seat.distinct("category");

        const paymentMethods = [

            "cash",

            "upi",

        ];

        res.status(200).json({

            success: true,

            floors,

            categories,

            paymentMethods

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};