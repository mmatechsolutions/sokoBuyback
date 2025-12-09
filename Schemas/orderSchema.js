import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Items in the order
    items: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    // Totals
    total: { type: Number, required: true }, // Cart subtotal
    deliveryFee: { type: Number, required: true }, // Fee based on county
    grandTotal: { type: Number, required: true }, // total + delivery

    // Customer information (auto-filled from context)
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      county: { type: String, required: true },
      localTown: { type: String, required: true },
    },

    // ============================
    // ORDER STATUS TRACKING
    // ============================
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
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

    // Optional shipping information (can be filled later)
    shipping: {
      address: { type: String },
      city: { type: String },
      phone: { type: String },
      trackingNumber: { type: String },
      courier: { type: String }, // e.g., "G4S", "Fargo", "Posta"
    },

    // Order creation date
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
