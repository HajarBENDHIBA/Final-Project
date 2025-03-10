// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Link to the user who made the order
  products: [{ 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true },
  paymentDetails: { 
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true },
  },
  orderStatus: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
