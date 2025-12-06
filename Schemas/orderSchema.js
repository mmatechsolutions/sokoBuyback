import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    total: { type: Number, required: true },

    // ============================
    // ORDER STATUS TRACKING
    // ============================

    status: {
      type: String,
      enum: [
        "pending", // user created order but not processed
        "processing", // payment confirmed, preparing order
        "shipped", // order dispatched
        "delivered", // customer received order
        "cancelled", // order cancelled
      ],
      default: "pending",
    },

    // History of stage changes
    statusHistory: [
      {
        status: { type: String },
        message: { type: String }, // Optional: "Shipped via G4S"
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    // Optional shipping information
    shipping: {
      address: { type: String },
      city: { type: String },
      phone: { type: String },
      trackingNumber: { type: String },
      courier: { type: String }, // e.g., "G4S", "Fargo", "Posta"
    },

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
