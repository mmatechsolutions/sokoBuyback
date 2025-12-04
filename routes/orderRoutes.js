import express from "express";
import Order from "../Schemas/orderSchema.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// Checkout (create order)
router.post("/checkout", protect, async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const order = new Order({
      userId: req.user.id, // link order to logged-in user
      items,
      total,
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get orders for logged-in user
router.get("/orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
