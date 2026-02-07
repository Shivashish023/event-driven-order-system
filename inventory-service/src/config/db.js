import mongoose from "mongoose";

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Db connected");
    }
    catch(err){
        console.error("DB connection failed :",err.message);
        process.exit(0);
    }
}
export default connectDb;