import mongoose from 'mongoose' 
const attendanceSchema=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    attendanceDate:{
        type:Date,
        required:true
    },
    entryTime:{
        type:Date,
        default:null
    },
    exitTime:{
        type:Date,
        default:null
    },
    verificationMethod:{
        type:String,
        enum:["qr","gps"],
        required:true
    },
    verification:{
        method:{
            type:String,
            enum:["qr","gps"]
        },
        latitude:Number,
        longitude:Number,
        qrSessionId:String
    },
    status:{
        type:String,
        enum:["inside","completed"],
        default:"inside"
    },
},{timestamps:true});

attendanceSchema.index(
    {
        student:1,
        attendanceDate:1
    },
    {
        unique:true
    }
)

export default mongoose.model(
    "Attendance",
    attendanceSchema
)