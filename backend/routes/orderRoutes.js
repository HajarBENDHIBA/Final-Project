import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create a new order
router.post('/', verifyToken, createOrder);

// Get user's orders
router.get('/', verifyToken, getOrders);

export default router; 