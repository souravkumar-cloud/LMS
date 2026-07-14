import mongoose from "mongoose";

const qrSessionSchema = new mongoose.Schema(

    {

        token: {

            type: String,

            required: true,

            unique: true

        },

        expiresAt: {

            type: Date,

            required: true

        },

        isActive: {

            type: Boolean,

            default: true

        },

        createdBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        }

    },

    {

        timestamps: true

    }

);

// Automatically delete expired QR sessions
qrSessionSchema.index(
    {
        expiresAt: 1
    },
    {
        expireAfterSeconds: 0
    }
);

const QRSession = mongoose.model(
    "QRSession",
    qrSessionSchema
);

export default QRSession;