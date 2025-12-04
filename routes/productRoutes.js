// routes/productRoutes.js
import express from "express";
import multer from "multer";
import {
  createProduct,
  fetchProducts,
} from "../controllers/productControllers.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/products", upload.single("image"), createProduct);
router.get("/products", fetchProducts);

export default router;
