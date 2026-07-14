import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);

        console.log("=================================");
        console.log("MongoDB Connected Successfully");
        console.log(`Host: ${connection.connection.host}`);
        console.log("=================================");
    } catch (error) {
        console.log("=================================");
        console.log("MongoDB Connection Failed");
        console.log(error.message);
        console.log("=================================");
        process.exit(1);
    }
};

export default connectDB;