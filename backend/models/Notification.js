import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        enum: [
            "announcement",
            "seat",
            "attendance",
            "subscription",
            "payment",
            "system"
        ],
        required: true
    },

    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    isBroadcast: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    priority: {
        type: String,
        enum: [
            "low",
            "medium",
            "high"
        ],
        default: "medium"
    },

    actionUrl: {
        type: String,
        default: ""
    },

    expiresAt: {
        type: Date,
        default: null
    }

},
{
    timestamps: true
}
);

notificationSchema.index({
    recipient: 1,
    createdAt: -1
});

notificationSchema.index({
    expiresAt: 1
});

export default mongoose.model(
    "Notification",
    notificationSchema
);