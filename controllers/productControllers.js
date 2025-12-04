import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Product from "../Schemas/productSchema.js";
import dotenv from "dotenv";

dotenv.config();

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image not received" });
    }

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

    fs.unlinkSync(req.file.path);

    const newProduct = await Product.create({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      image: upload.secure_url,
    });

    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find(); // query MongoDB directly
    res.status(200).json({ products });
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};
