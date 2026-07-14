import cron from "node-cron";
import Notification from "../models/Notification.js";

const deleteExpiredNotifications = () => {

    // Every hour
    cron.schedule("0 * * * *", async () => {

        try {

            const result = await Notification.deleteMany({

                expiresAt: {
                    $lte: new Date()
                }

            });

            console.log(
                `Expired Notifications Deleted : ${result.deletedCount}`
            );

        }

        catch (error) {

            console.log(
                "Notification Cleanup Error:",
                error.message
            );

        }

    });

};

export default deleteExpiredNotifications;