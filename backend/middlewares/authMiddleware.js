import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware=async (req,res,next)=>{
    try {
        const authHeader=req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                success:false,
                message:"Authorization header missing"
            });
        }
        if(!authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Invalid token format"
            });
        }
        const token=authHeader.split(" ")[1];
        const decode=jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user=await User.findById(decode.id).select("-password");
        
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        
        if(!user.isActive){
            return res.status(403).json({
                success:false,
                message:"Account is Deactivated"
            });
        }
        req.user={
            id:user._id,
            fullName:user.fullName,
            role:user.role,
            email:user.email
        };
        next();
    } catch (error) {
        res.status(401).json({
            message:"Invalid or Expired token"
        })
    }
}

export default authMiddleware;