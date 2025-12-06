import express from "express";
import {
  getDailySales,
  getStatusCounts,
  getBestProducts,
  getSummary,
} from "../controllers/adminStatsControllers.js";
import { verifyAdmin } from "../middleware/authmiddleware.js";

const router = express.Router();

// All routes protected by admin middleware
router.get("/daily-sales", verifyAdmin, getDailySales);
router.get("/status-counts", verifyAdmin, getStatusCounts);
router.get("/best-products", verifyAdmin, getBestProducts);
router.get("/summary", verifyAdmin, getSummary);

export default router;
