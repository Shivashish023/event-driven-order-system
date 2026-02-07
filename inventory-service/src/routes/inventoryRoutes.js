import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById } from "../controllers/inventoryController.js";

const router=express.Router();
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:productId", getProductById);
router.delete("/:productId", deleteProduct)
export default router;
