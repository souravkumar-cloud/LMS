import cron from "node-cron";

import Subscription from "../models/Subscription.js";
import Seat from "../models/Seat.js";
import Notification from "../models/Notification.js";
import Payment from "../models/Payment.js";

/*
==================================================
Run Every Night At 12:00 AM
==================================================
*/

const subscriptionExpiryJob = () => {

    cron.schedule(

        "0 0 * * *",

        async () => {

            try {

                const today = new Date();

                today.setHours(0,0,0,0);

                // Notify users 3 days before expiry
                const threeDaysFromNowStart = new Date(today);
                threeDaysFromNowStart.setDate(today.getDate() + 3);
                threeDaysFromNowStart.setHours(0, 0, 0, 0);

                const threeDaysFromNowEnd = new Date(today);
                threeDaysFromNowEnd.setDate(today.getDate() + 3);
                threeDaysFromNowEnd.setHours(23, 59, 59, 999);

                const expiringSoonSubscriptions = await Subscription.find({
                    status: "active",
                    endDate: {
                        $gte: threeDaysFromNowStart,
                        $lte: threeDaysFromNowEnd
                    }
                });

                console.log(
                    `Found ${expiringSoonSubscriptions.length} subscriptions expiring in 3 days.`
                );

                for (const subscription of expiringSoonSubscriptions) {
                    const existingNotice = await Notification.findOne({
                        recipient: subscription.student,
                        title: "Subscription Expiration Alert",
                        createdAt: { $gte: today }
                    });

                    if (!existingNotice) {
                        await Notification.create({
                            recipient: subscription.student,
                            title: "Subscription Expiration Alert",
                            message: "Your subscription is set to expire in 3 days. Please submit your fees to continue using the library services.",
                            type: "subscription",
                            priority: "high",
                            adminOnly: true,
                            createdBy: subscription.student
                        });
                    }
                }

                const expiredSubscriptions = await Subscription.find({

                    status: "active",

                    endDate: {

                        $lt: today

                    }

                }).populate("plan");

                console.log(

                    `Found ${expiredSubscriptions.length} expired subscriptions.`

                );

                for (const subscription of expiredSubscriptions) {

                    // Mark Subscription Expired

                    subscription.status = "expired";

                    await subscription.save();

                    // Release Seat

                    const seat = await Seat.findOne({

                        student: subscription.student

                    });

                    if (seat) {

                        seat.student = null;

                        seat.status = "available";

                        await seat.save();

                    }

                    // Create Pending Payment for Renewal
                    if (subscription.plan) {
                        await Payment.create({
                            student: subscription.student,
                            plan: subscription.plan._id,
                            subscription: subscription._id,
                            amount: subscription.plan.price,
                            paymentMethod: "pending",
                            paymentType: "subscription-renewal",
                            paymentStatus: "pending",
                            receiptNumber: `RCPT-EXP-${Date.now()}`
                        });
                    }

                    // Create Notification

                    await Notification.create({

                        recipient: subscription.student,

                        title: "Subscription Expired - Fee Due",

                        message:

                        "Your subscription has expired. Please pay the fee immediately to renew your plan and continue using library services.",

                        type: "subscription",

                        priority: "high"

                    });

                }

                console.log(

                    "Subscription Expiry Job Completed"

                );

            }

            catch (error) {

                console.log(

                    error.message

                );

            }

        }

    );

};

export default subscriptionExpiryJob;