import express from "express";
import { proxyRequest } from "../controllers/proxyController.js";

const router = express.Router();

router.use((req, res) => proxyRequest(req, res, "AUTH"));

export default router;