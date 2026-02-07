import express from "express";
import  {createOrder,getAllOrders,getOrderById ,getOrdersByUserId} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/",getAllOrders);
router.get("/:id",getOrderById);
router.get("/:userId",getOrdersByUserId);
export default router;
