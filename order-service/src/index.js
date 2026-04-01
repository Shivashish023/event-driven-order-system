import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "./config/db.js";
import router from "./routes/orderRoutes.js";
import inventoryConsumer from "./consumers/inventoryConsumer.js";

const app = express();
app.use(express.json());

const port = process.env.PORT || 5001;

connectDb();

app.use("/orders", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
