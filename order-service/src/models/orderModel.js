import mongoose from "mongoose";

const orderSchema=new mongoose.Schema(
    {
        userId:{type:String,required:true},
        items:[{
            productId:String,
            quantity:Number,
            price:Number
        }],
        totalAmount:{type:Number,required:true},
        status:{
            type:String,
            enum:["CREATED","PAID","FAILED"],
            default:"CREATED"
        }
    },
    {timestamps:true}
);
export   const Order = mongoose.model("Order", orderSchema);