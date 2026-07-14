import mongoose, { mongo } from "mongoose";

const paymentSchema=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    subscription:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubscriptionPlan",
        required:true
    },
    paymentType:{
        type:String,
        enum:[
            "subscription-renewal",
            "new-admission",
            "seat-upgrade",
            "fine",
            "other"
        ],
        required:true
    },
    amount:{
        type:Number,
        required:true,
        min:0
    },
    paymentMethod:{
        type:String,
        enum:["cash","upi"],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["pending","paid"],
        default:"pending"
    },
    receiptNumber:{
        type:String,
        unique:true,
        required:true
    },
    plan:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubscriptionPlan",
        required:true
    },
    paidAt:{
        type:Date,
        required:true
    }
},{timestamps:true});


export default mongoose.model(
    "Payment",
    paymentSchema
);