
import publishOrderCreated from "../producers/orderProducer.js";
import { Order } from "../models/orderModel.js";
 const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    await publishOrderCreated(order);
    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Order creation failed", details: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Order retrieval error:", err);
    res.status(500).json({ error: "Order retrieval failed", details: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    console.error("Order retrieval error:", err);
    res.status(500).json({ error: "Order retrieval failed", details: err.message });
  }
};
const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Order retrieval error:", err);
    res.status(500).json({ error: "Order retrieval failed", details: err.message });
  }
};
export  {createOrder,getAllOrders,getOrderById,getOrdersByUserId};