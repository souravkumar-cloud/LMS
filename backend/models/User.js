import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
    },

    aadhaar: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\d{12}$/, "Aadhaar must be exactly 12 digits"]
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },

    isActive: {
        type: Boolean,
        default: true
    },
    // New Fields
    profilePhoto: {
        type: String,
        default: ""
    },

    gender: {
        type: String,
        enum: ["Male", "Female","Other"],
        default: "Male"
    },

    address: {
        type: String,
        trim: true,
        default: ""
    },

    emergencyContact: {
        type: String,
        match: [/^\d{10}$/, "Emergency contact must be 10 digits"]
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;