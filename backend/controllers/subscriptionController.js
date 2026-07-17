import Subscription from "../models/Subscription.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import Notification from "../models/Notification.js";

export const createPlan = async (req, res) => {

    try {

        const {

            name,

            category,

            accessType,

            durationInDays,

            hoursPerDay,

            price

        } = req.body;

        const exists = await SubscriptionPlan.findOne({

            name

        });

        if (exists) {

            return res.status(400).json({

                success:false,

                message:"Plan already exists."

            });

        }

        const plan = await SubscriptionPlan.create({

            name,

            category,

            accessType,

            durationInDays,

            hoursPerDay,

            price

        });

        res.status(201).json({

            success:true,

            message:"Plan Created Successfully",

            plan

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};


export const getPlans = async (req,res)=>{

    try{

        const plans = await SubscriptionPlan.find({

            isActive:true

        }).sort({

            price:1

        });

        res.status(200).json({

            success:true,

            plans

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

export const mySubscription = async (req,res)=>{

    try{

        const subscription = await Subscription.findOne({

            student:req.user.id,

            status:"active"

        }).populate("plan");

        if(!subscription){

            return res.status(404).json({

                success:false,

                message:"No Active Subscription"

            });

        }

        res.status(200).json({

            success:true,

            subscription

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

export const renewSubscription = async (req,res)=>{

    try{

        const subscription = await Subscription.findOne({

            student:req.user.id,

            status:"active"

        });

        if(!subscription){

            return res.status(404).json({

                success:false,

                message:"Subscription not found."

            });

        }

        const plan = await SubscriptionPlan.findById(

            subscription.plan

        );

        const currentEndDate = new Date(subscription.endDate);
        currentEndDate.setMonth(currentEndDate.getMonth() + 1);
        subscription.endDate = currentEndDate;

        await subscription.save();

        await Notification.create({

            title:"Subscription Renewed",

            message:"Your subscription has been renewed successfully.",

            type:"subscription",

            recipient:req.user.id,

            createdBy:req.user.id

        });

        res.status(200).json({

            success:true,

            message:"Subscription Renewed",

            subscription

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

export const calculateUpgradeAmount = (
    currentPlan,
    requestedPlan
) => {

    if(requestedPlan.price <= currentPlan.price){

        return 0;

    }

    return requestedPlan.price - currentPlan.price;

};

export const subscribePlan = async (req, res) => {

    try {

        const { planId } = req.body;

        const plan = await SubscriptionPlan.findById(planId);

        if (!plan) {

            return res.status(404).json({
                success: false,
                message: "Subscription plan not found."
            });

        }

        const existingSubscription = await Subscription.findOne({

            student: req.user.id,
            status: "active"

        });

        if (existingSubscription) {

            return res.status(400).json({

                success: false,
                message: "You already have an active subscription."

            });

        }

        const startDate = new Date();

        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        const subscription = await Subscription.create({

            student: req.user.id,
            plan: plan._id,
            startDate,
            endDate,
            status: "active",
            createdBy: req.user.id

        });

        res.status(201).json({

            success: true,
            message: "Subscription created successfully.",
            subscription

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

export const upgradeSubscription = async (req, res) => {
    try {

        const { planId } = req.body;

        const subscription = await Subscription.findOne({
            student: req.user.id,
            status: "active"
        }).populate("plan");

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Active subscription not found."
            });
        }

        const requestedPlan = await SubscriptionPlan.findById(planId);

        if (!requestedPlan) {
            return res.status(404).json({
                success: false,
                message: "Requested plan not found."
            });
        }

        if (
            subscription.plan._id.toString() ===
            requestedPlan._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "You are already subscribed to this plan."
            });
        }

        const extraAmount = calculateUpgradeAmount(
            subscription.plan,
            requestedPlan
        );

        if (extraAmount === 0) {
            return res.status(400).json({
                success: false,
                message: "Selected plan is cheaper or equal to your current plan."
            });
        }

        res.status(200).json({
            success: true,
            message: "Upgrade request created.",
            currentPlan: subscription.plan.name,
            requestedPlan: requestedPlan.name,
            amountToPay: extraAmount,
            planId: requestedPlan._id
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const approveUpgrade = async (req, res) => {

    try {

        const {
            studentId,
            planId
        } = req.body;

        const subscription = await Subscription.findOne({
            student: studentId,
            status: "active"
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found."
            });
        }

        const newPlan = await SubscriptionPlan.findById(planId);

        if (!newPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found."
            });
        }

        subscription.plan = newPlan._id;

        const nextMonthDate = new Date();
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        subscription.endDate = nextMonthDate;

        await subscription.save();

        await Notification.create({
            title: "Subscription Upgraded",
            message: `Your subscription has been upgraded to ${newPlan.name}.`,
            type: "subscription",
            recipient: studentId,
            createdBy: req.user.id
        });

        res.status(200).json({
            success: true,
            message: "Subscription upgraded successfully.",
            subscription
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};