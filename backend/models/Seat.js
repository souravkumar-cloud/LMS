import mongoose from 'mongoose';

const seatSchema=new mongoose.Schema({
    seatNumber:{
        type:Number,
        unique:true,
        required:true
    },
    floor:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["available","occupied","hold"],
        default:"available"
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    category:{
        type:String,
        enum:["regular","premium","hourly"],
        required:true
    }
},{timestamps:true});

export default mongoose.model(
    "Seat",
    seatSchema
);