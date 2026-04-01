import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "./config/db.js";
import router from "./routes/inventoryRoutes.js";
import orderConsumer from "./consumers/orderConsumer.js";
import paymentConsumer from "./consumers/paymentConsumer.js";

const app = express();
app.use(express.json());
const port = process.env.PORT || 5002;

connectDb();
app.use("/inventory", router);



app.listen(port, () => {
  console.log(`Inventory Server running on port ${port}...`);
});