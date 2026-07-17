import SubscriptionPlan from "../models/SubscriptionPlan.js";

export const createPlan = async (req, res) => {
    try {
        let { name, category, accessType, durationInDays, hoursPerDay, price } = req.body;

        // Auto-assign accessType based on category
        if (category === "not fixed") {
            accessType = "hourly";
        } else {
            accessType = "full-day";
        }

        const exists = await SubscriptionPlan.findOne({ name });
        if (exists) {
            return res.status(400).json({ success: false, message: "Plan already exists." });
        }

        const plan = await SubscriptionPlan.create({ name, category, accessType, durationInDays, hoursPerDay, price });

        res.status(201).json({ success: true, message: "Plan Created Successfully", plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
        res.status(200).json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePlan = async (req, res) => {
    try {
        if (req.body.category) {
            if (req.body.category === "not fixed") {
                req.body.accessType = "hourly";
            } else {
                req.body.accessType = "full-day";
            }
        }
        const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
        res.status(200).json({ success: true, message: "Plan updated", plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deletePlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
        res.status(200).json({ success: true, message: "Plan deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
