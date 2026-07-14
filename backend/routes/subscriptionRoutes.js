import express from "express";

import {

    approveUpgrade,
    mySubscription,

    renewSubscription,
    subscribePlan,
    upgradeSubscription

} from "../controllers/subscriptionController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// View My Subscription
router.get(

    "/my",

    authMiddleware,

    mySubscription

);

// Renew Subscription
router.put(

    "/renew",

    authMiddleware,

    renewSubscription

);

router.post(
    "/subscribe",
    authMiddleware,
    subscribePlan
);


router.put(
    "/upgrade",
    authMiddleware,
    upgradeSubscription
);

router.put(
    "/upgrade/approve",
    authMiddleware,
    adminMiddleware,
    approveUpgrade
);


export default router;