import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(

    {

        admin: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        action: {

            type: String,

            required: true

        },

        module: {

            type: String,

            enum: [

                "student",

                "seat",

                "attendance",

                "payment",

                "subscription",

                "notification",

                "library-settings",

                "dashboard"

            ],

            required: true

        },

        targetId: {

            type: mongoose.Schema.Types.ObjectId,

            default: null

        },

        details: {

            type: Object,

            default: {}

        },

        ipAddress: {

            type: String,

            default: ""

        },

        userAgent: {

            type: String,

            default: ""

        }

    },

    {

        timestamps: true

    }

);

const AuditLog = mongoose.model(

    "AuditLog",

    auditLogSchema

);

export default AuditLog;