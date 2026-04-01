import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateReq.js";
import { registerSchema, loginSchema } from "../middleware/validateReq.js";

const router = express.Router();
router.post("/logout", logout);
router.post("/register", validateRequest(registerSchema),register);
router.post("/login", validateRequest(loginSchema), login);
export default router;