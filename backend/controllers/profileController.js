import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import Seat from "../models/Seat.js";
import cloudinary from "../config/cloudinary.js";

/*
====================================================
Get My Profile
(Student/Admin)
====================================================
*/
export const getMyProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

/*
====================================================
Update My Profile
(Student/Admin)
====================================================
*/
export const updateProfile = async (req, res) => {

    try {

        const {
            fullName,
            phone,
            gender,
            address,
            aadhaar,
            emergencyContact
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (fullName !== undefined) user.fullName = fullName;
        if (phone !== undefined) user.phone = phone;
        if (gender !== undefined) user.gender = gender;
        if (address !== undefined) user.address = address;
        if (aadhaar !== undefined) user.aadhaar = aadhaar;
        if (emergencyContact !== undefined) {
            user.emergencyContact = emergencyContact;
        }



        await user.save();

        const safeUser = await User.findById(user._id)
            .select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: safeUser
        });

    } catch (error) {

        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
====================================================
Profile Summary
(Student/Admin)
====================================================
*/
export const profileSummary = async (req, res) => {

    try {

        const [user, seat, subscription] = await Promise.all([

            User.findById(req.user.id)
                .select("-password"),

            Seat.findOne({
                student: req.user.id
            }),

            Subscription.findOne({
                student: req.user.id,
                status: "active"
            }).populate("plan")

        ]);

        res.status(200).json({
            success: true,
            profile: {
                user,
                seat,
                subscription
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
