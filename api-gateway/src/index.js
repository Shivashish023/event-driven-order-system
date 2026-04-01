import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});