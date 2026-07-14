import Seat from "../models/Seat.js";
import SeatRequest from "../models/SeatRequest.js";
import Subscription from "../models/Subscription.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket/socket.js";
import User from "../models/User.js";

export const createSeatRequest = async (req, res) => {

    console.log("Headers:", req.headers);
    console.log("Body:", req.body);


    try {

        const studentId = req.user.id;

        const {

            requestedSeatId,
            remarks

        } = req.body;

        // Check seat exists

        const seat = await Seat.findById(requestedSeatId);

        if (!seat) {

            return res.status(404).json({

                success: false,

                message: "Seat not found."

            });

        }

        // Seat available?

        if (seat.status !== "available") {

            return res.status(400).json({

                success: false,

                message: "Seat is not available."

            });

        }

        // Existing pending request?

        const pendingRequest = await SeatRequest.findOne({

            student: studentId,

            status: {

                $in: [

                    "pending",

                    "pending"

                ]

            }

        });

        if (pendingRequest) {

            return res.status(400).json({

                success: false,

                message: "You already have a pending request."

            });

        }

        // Current seat

        const currentSeat = await Seat.findOne({

            student: studentId

        });

        if (
            currentSeat &&
            currentSeat._id.toString() === requestedSeatId
        ) {
            return res.status(400).json({
                success: false,
                message: "You are already using this seat."
            });
        }

        const requestType = currentSeat

            ? "seat-change"

            : "new-seat";

        const seatRequest = await SeatRequest.create({

            student: studentId,

            currentSeat: currentSeat?._id || null,

            requestedSeat: requestedSeatId,

            requestType,

            paymentCompleted: true,

            status: "pending",

            remarks

        });
        const pendingCount = await SeatRequest.countDocuments({
            status: "pending"
        })
        getIO().emit("seatRequestCreated", pendingCount);
        res.status(201).json({

            success: true,

            message: "Seat Request Created",

            seatRequest

        });

    }

    catch (error) {

        console.error("========== Seat Request Error ==========");
        console.error(error);
        console.error(error.stack);

        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack
        });

    }

};


export const mySeatRequests = async (req, res) => {

    try {

        const requests = await SeatRequest.find({

            student: req.user.id

        })

            .populate("requestedSeat")

            .populate("currentSeat")

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            requests

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


export const getPendingSeatRequests = async (req, res) => {

    try {

        const requests = await SeatRequest.find({

            status: "pending"

        })

            .populate(

                "student",

                "fullName email phone"

            )

            .populate("requestedSeat")

            .populate("currentSeat")

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            total: requests.length,

            requests

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


export const approveSeatRequest = async (req, res) => {

    try {

        const request = await SeatRequest.findById(req.params.id);

        if (!request) {

            return res.status(404).json({

                success: false,

                message: "Seat request not found."

            });

        }

        if (request.status !== "pending") {

            return res.status(400).json({

                success: false,

                message: "Request already processed."

            });

        }

        const newSeat = await Seat.findById(

            request.requestedSeat

        );

        if (!newSeat) {

            return res.status(404).json({

                success: false,

                message: "Requested seat not found."

            });

        }

        if (newSeat.status !== "available") {

            return res.status(400).json({

                success: false,

                message: "Requested seat is no longer available."

            });

        }

        // Release previous seat

        if (request.currentSeat) {

            const oldSeat = await Seat.findById(

                request.currentSeat

            );

            if (oldSeat) {

                oldSeat.student = null;

                oldSeat.status = "available";

                await oldSeat.save();

            }

        }

        // Assign new seat

        newSeat.student = request.student;

        newSeat.status = "occupied";

        await newSeat.save();

        await User.findByIdAndUpdate(
            request.student,
            {
                seatId: newSeat._id
            }
        )

        request.status = "approved";

        request.reviewedBy = req.user.id;

        request.reviewedAt = new Date();

        await request.save();

        const notification = await Notification.create({

            title: "Seat Request Approved",

            message: `Your request for Seat ${newSeat.seatNumber} has been approved.`,

            type: "seat",

            recipient: request.student,

            createdBy: req.user.id

        });

        getIO()
            .to(request.student.toString())
            .emit("newNotification", notification);
            
        const pendingCount = await SeatRequest.countDocuments({
            status: "pending"
        });
        getIO().emit("seatRequestApproved", {
            pendingCount
        })
        res.status(200).json({

            success: true,

            message: "Seat Assigned Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const rejectSeatRequest = async (req, res) => {

    try {

        const request = await SeatRequest.findById(

            req.params.id

        );

        if (!request) {

            return res.status(404).json({

                success: false,

                message: "Request not found."

            });

        }

        request.status = "rejected";

        request.reviewedBy = req.user.id;

        request.reviewedAt = new Date();

        await request.save();

        const notification = await Notification.create({

            title: "Seat Request Rejected",

            message: "Your seat request has been rejected.",

            type: "seat",

            recipient: request.student,

            createdBy: req.user.id

        });

        getIO().to(request.student.toString()).emit("newNotification", notification);
        const pendingCount = await SeatRequest.countDocuments({
            status: "pending-approval"
        })

        getIO().emit("seatRequestRejected", {
            pendingCount
        });
        res.status(200).json({

            success: true,

            message: "Seat Request Rejected"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const cancelSeatRequest = async (req, res) => {

    try {

        const request = await SeatRequest.findById(

            req.params.id

        );

        if (!request) {

            return res.status(404).json({

                success: false,

                message: "Request not found."

            });

        }

        if (

            request.student.toString()

            !==

            req.user.id

        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized"

            });

        }

        if (request.status !== "pending-approval") {

            return res.status(400).json({

                success: false,

                message: "Cannot cancel this request."

            });

        }

        request.status = "cancelled";

        await request.save();

        res.status(200).json({

            success: true,

            message: "Request Cancelled"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};