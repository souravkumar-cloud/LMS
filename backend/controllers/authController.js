import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import jwt from 'jsonwebtoken';

export const login=async(req,res)=>{

    try{
        const {email,password}=req.body;

        const user=await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        if(!user.isActive){
            return res.status(403).json({
                success:false,
                message:"Account Deactivated"
            });
        }
        const isMatch=await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid Password"
            })
        }
        user.lastLogin=new Date();
        await user.save();
        const token=generateToken(user);
        res.status(200).json({
            success:true,
            message:"Login Successful",
            token,
            user
        });
    }catch(error){
        console.error("========== LOGIN ERROR ==========");
        console.error(error);
        console.error(error.stack);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createStudent=async(req,res)=>{
    try {
        const {
            fullName,
            email,
            phone,
            aadhaar,
            password,
        }=req.body;

        const userExists=await User.findOne({email});

        if(userExists){
            return res.status(400).json({
                message:"Student already Exists"
            })
        }

        const hashPassword=await bcrypt.hash(password,10);

        const student=await User.create({
            fullName,
            email,
            phone,
            aadhaar,
            password:hashPassword,
            role:"student"
        });

        res.status(201).json({
            success:true,
            message:"Student Created Successfully",
            student
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
};

export const changePassword=async(req,res)=>{
    try {
        const {
            oldPassword,
            newPassword,
            confirmPassword
        }=req.body;
        if(newPassword!==confirmPassword){
            return res.status(400).json({
                message:"Passwords do not match"
            });
        }
        // console.log(req.user);
        const user=await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });
        }

        const isMatch=await bcrypt.compare(
            oldPassword,
            user.password
        );

        if(!isMatch){
            return res.status(400).json({
                message:"Old password is incorrect"
            });
        }
        const hashPassword=await bcrypt.hash(
            newPassword,
            10
        );
        user.password=hashPassword;
        user.passwordChangedAt=new Date();
        await user.save();
        const safeUser = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            profileImage: user.profileImage
        };
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        res.status(200).json({
            success:true,
            message:"Password change Successfully",
            token,
            user:safeUser
        });
    } catch (error) {
        res.status(500).json({
            message:error.message,
            success:false
        });
    }
}

export const createAdmin = async (req, res) => {
    try {

        const {
            fullName,
            email,
            phone,
            aadhaar,
            password
        } = req.body;

        const adminExists=await User.findOne({
            email,
            role:"admin"
        });
        if(adminExists){
            return res.status(400).json({
                success:false,
                message:"Admin already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const admin = await User.create({
            fullName,
            email,
            phone,
            aadhaar,
            password: hashedPassword,
            role: "admin"
        });

        res.status(201).json({
            success: true,
            message:"Admin Created Successfully",
            admin
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};