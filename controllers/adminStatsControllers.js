import Order from "../Schemas/orderSchema.js";
import Product from "../Schemas/productSchema.js";
import mongoose from "mongoose";

// ---------------- DAILY SALES ----------------
export const getDailySales = async (req, res) => {
  try {
    // Aggregate daily revenue and orders
    const dailySales = await Order.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1, "_id.day": 1 } },
    ]);
    res.json(dailySales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch daily sales" });
  }
};

// ---------------- STATUS COUNTS ----------------
export const getStatusCounts = async (req, res) => {
  try {
    const statusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json(statusCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch status counts" });
  }
};

// ---------------- BEST PRODUCTS ----------------
export const getBestProducts = async (req, res) => {
  try {
    const bestProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: "$productDetails.name",
          totalSold: 1,
        },
      },
    ]);
    res.json(bestProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch best products" });
  }
};

// ---------------- SUMMARY ----------------
export const getSummary = async (req, res) => {
  try {
    const totalRevenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

    const totalOrders = await Order.countDocuments();
    const totalItemsSoldResult = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, totalItems: { $sum: "$items.quantity" } } },
    ]);
    const totalItemsSold = totalItemsSoldResult[0]?.totalItems || 0;

    const totalCustomers = await Order.distinct("userId").then(
      (users) => users.length
    );
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrdersResult = await Order.aggregate([
      { $match: { createdAt: { $gte: today } } },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$totalAmount" },
          todayOrders: { $sum: 1 },
        },
      },
    ]);
    const todayRevenue = todayOrdersResult[0]?.todayRevenue || 0;
    const todayOrders = todayOrdersResult[0]?.todayOrders || 0;

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalItemsSold,
      avgOrderValue,
      todayRevenue,
      todayOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};
