import mongoose from "mongoose";

const subscriptionSchema=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    plan:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubscriptionPlan",
        required:true
    },
    payment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Payment",
        default:null
    },
    startDate:{
        type:Date,
        default:Date.now
    },
    endDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["active","expired"],
        default:"active"
    }
},{timestamps:true});

export default mongoose.model(
    "Subscription",
    subscriptionSchema
)