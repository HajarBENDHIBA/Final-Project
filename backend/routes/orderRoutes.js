import express from 'express';
import { createOrder, getOrders, deleteOrder } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create a new order
router.post('/', verifyToken, createOrder);

// Get user's orders
router.get('/', verifyToken, getOrders);

// Delete an order
router.delete('/:id', verifyToken, deleteOrder);

export default router; 