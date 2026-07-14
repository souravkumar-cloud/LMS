import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const librarySettingSchema = new mongoose.Schema(

    {

        libraryName: {

            type: String,

            default: "Library Management System"

        },

        openingTime: {

            type: String,

            default: "08:00"

        },

        closingTime: {

            type: String,

            default: "22:00"

        },

        gpsRadius: {

            type: Number,

            default: 50

        },

        qrExpirySeconds: {

            type: Number,

            default: 60

        },

        attendanceGraceMinutes: {

            type: Number,

            default: 15

        },

        maxSeatChangeRequestsPerMonth: {

            type: Number,

            default: 5

        },

        allowGPSAttendance: {

            type: Boolean,

            default: true

        },

        allowQRAttendance: {

            type: Boolean,

            default: true

        },

        address: {

            type: String,

            default: ""

        },

        latitude: {

            type: Number,

            default:Number(process.env.LIBRARY_LATITUDE) || 0

        },

        longitude: {

            type: Number,

            default: Number(process.env.LIBRARY_LONGITUDE) || 0

        },
        

    },

    {

        timestamps: true

    }

);

const LibrarySetting = mongoose.model(

    "LibrarySetting",

    librarySettingSchema

);

export default LibrarySetting;