// orderRoutes.js
import express from "express";
import { getOrders, createOrder, deleteOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js"; // Ensure this is imported

const router = express.Router();

// Fetch all orders for a user
router.get("/", protect, getOrders);

// Create a new order
router.post("/", protect, createOrder);

// Delete an order by ID
router.delete("/:orderId", protect, deleteOrder);

export default router;
