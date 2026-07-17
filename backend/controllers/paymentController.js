import mongoose from "mongoose";

import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import Notification from "../models/Notification.js";

import generateReceipt from "../utils/generateReceipt.js";

const generateReceiptNumber = () => {

    const date = new Date();

    const yyyy = date.getFullYear();

    const mm = String(date.getMonth() + 1).padStart(2, "0");

    const dd = String(date.getDate()).padStart(2, "0");

    const random = Math.floor(

        1000 + Math.random() * 9000

    );

    return `LMS-${yyyy}${mm}${dd}-${random}`;

};

export const createPayment = async (req, res) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const {

            subscriptionId,

            paymentMethod,

            transactionId,

            remarks

        } = req.body;

        const subscription = await Subscription.findById(

            subscriptionId

        ).session(session);

        if (!subscription) {

            throw new Error("Subscription not found.");

        }

        const existingPayment = await Payment.findOne({

            subscription: subscriptionId,

            status: "success"

        }).session(session);

        if (existingPayment) {

            throw new Error(

                "Payment already completed."

            );

        }

        const plan = await SubscriptionPlan.findById(

            subscription.plan

        ).session(session);

        const payment = await Payment.create([{

            student: subscription.student,

            subscription: subscription._id,

            plan: plan._id,

            amount: plan.price,

            paymentType: "new-subscription",

            paymentMethod,

            transactionId,

            receiptNumber:

                generateReceiptNumber(),

            status: "success",

            remarks,

            receivedBy: req.user.id,

            paidAt: new Date()

        }], {

            session

        });

        subscription.status = "active";

        await subscription.save({

            session

        });

        await Notification.create([{

            title: "Payment Successful",

            message:

            `₹${plan.price} payment received successfully.`,

            recipient: subscription.student,

            createdBy: req.user.id,

            type: "payment"

        }], {

            session

        });

        await session.commitTransaction();

        session.endSession();

        res.status(201).json({

            success: true,

            message: "Payment Successful",

            payment: payment[0]

        });

    }

    catch (error) {

        await session.abortTransaction();

        session.endSession();

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


export const paymentHistory = async (req, res) => {

    try {

        let query = {};
        if (req.user.role === "student") {
            query.student = req.user.id;
        }

        const payments = await Payment.find(query)

        .populate(

            "plan",

            "name"

        )

        .populate(

            "student",

            "fullName email phone"

        )

        .sort({

            paidAt: -1

        });

        res.status(200).json({

            success: true,

            payments

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const totalRevenue = async (req, res) => {

    try {

        const revenue = await Payment.aggregate([

            {
                $match: {
                    paymentStatus: "paid"
                }
            },

            {

                $group: {

                    _id: null,

                    totalRevenue: {

                        $sum: "$amount"

                    }

                }

            }

        ]);

        res.status(200).json({

            success: true,

            revenue:

            revenue[0]?.totalRevenue || 0

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const downloadReceipt = async (req, res) => {

    try {

        const payment = await Payment.findById(

            req.params.id

        )

        .populate(

            "student",

            "fullName email"

        )

        .populate(

            "plan",

            "name"

        );

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        if (

            req.user.role === "student" &&

            payment.student._id.toString() !== req.user.id

        ) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized"

            });

        }

        generateReceipt(

            payment,

            res

        );

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }

        await payment.deleteOne();

        res.status(200).json({
            success: true,
            message: "Payment record deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const collectPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentMethod } = req.body;

        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found."
            });
        }

        if (payment.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment has already been collected."
            });
        }

        payment.paymentStatus = "paid";
        payment.paymentMethod = paymentMethod || "cash";
        payment.paidAt = new Date();

        await payment.save();

        res.status(200).json({
            success: true,
            message: "Payment status updated to paid successfully.",
            payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};