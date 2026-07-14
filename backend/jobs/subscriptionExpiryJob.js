import cron from "node-cron";

import Subscription from "../models/Subscription.js";
import Seat from "../models/Seat.js";
import Notification from "../models/Notification.js";

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

                const expiredSubscriptions = await Subscription.find({

                    status: "active",

                    endDate: {

                        $lt: today

                    }

                });

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

                    // Create Notification

                    await Notification.create({

                        recipient: subscription.student,

                        title: "Subscription Expired",

                        message:

                        "Your subscription has expired. Your seat has been released.",

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