import express from "express";
import { proxyRequest } from "../controllers/proxyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use((req, res) => proxyRequest(req, res, "ORDER"));

export default router;