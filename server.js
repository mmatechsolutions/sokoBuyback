import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authroutes.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Database Error:", err));

app.use("/api", productRoutes);
app.use("/api", authRoutes);

app.get("/", (req, res) => res.send("Auth backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
