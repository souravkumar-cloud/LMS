import mongoose from "mongoose";
const seatRequestSchema=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    currentSeat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seat",
        default:null
    },
    requestedSeat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seat",
        required:true
    },
    requestType:{
        type:String,
        enum:["new-seat","seat-change"],
        required:true
    },
    extraCharge:{
        type:Number,
        default:0
    },
    paymentCompleted:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    }
},{timestamps:true});

export default mongoose.model(
    "SeatRequest",
    seatRequestSchema
)