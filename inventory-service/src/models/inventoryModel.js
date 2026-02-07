import mongoose from "mongoose";

const inventorySchema=mongoose.Schema(
    {
        productId:{
            type:String,
            required:true,
            unique:true,
        },
        name:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
            default:0
        }
    },
    {timestamps:true}
);
export const Inventory=mongoose.model("inventory",inventorySchema);