import mongoose from "mongoose";

const resInvSchema=mongoose.Schema(
    {
        orderId:{
            type:String,
            required:true,
            index:true,
        },
        items:[{
            productId:{
                type:String,
                required:true,
                index:true
            },
            quantity:{
                type:Number,
                required:true,
            },
            price:{
                type:Number,
                required:true,
            }
        }],
        status:{
            type:String,
            enum:["PENDING", "CONFIRMED", "RELEASED"],
            default:"PENDING"
        }
    },
    { timestamps: true }
);
export const resInventory=mongoose.model("resInventory",resInvSchema);