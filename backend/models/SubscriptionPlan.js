import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    accessType: {
        type: String,
        enum: ["full-day", "hourly"],
        required: true
    },

    category: {
        type: String,
        enum: ["regular", "premium","not fixed"],
        required: true
    },

    durationInDays: {
        type: Number,
        default: 0
    },

    hoursPerDay: {
        type: Number,
        default: null
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

export default mongoose.model(
    "SubscriptionPlan",
    subscriptionPlanSchema
);