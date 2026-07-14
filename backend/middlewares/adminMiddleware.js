

const adminMiddleware = (req,res,next) => {
    try {
        if(!req.user){
            return res.status(401).json({
                success:false,
                message:"Authentication Required"
            });
        }
        if(req.user.role!=="admin"){
            return res.status(403).json({
                success:false,
                message:"Access Denied. Admin Only."
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export default adminMiddleware
