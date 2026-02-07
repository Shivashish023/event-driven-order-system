import {Order} from "../models/orderModel.js";
const updateOrderStatus = async (orderID, status) => {
    try {
        const order = await Order.findByIdAndUpdate(orderID, { status }, { new: true });
        return order;
    } catch (err) {
        console.error("Order status update error:", err);
        throw err;
    }
};
export  {updateOrderStatus};