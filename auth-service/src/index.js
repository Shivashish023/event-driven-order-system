import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();  
app.use(express.json());
 connectDb();
app.use("/api/auth", authRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});