import express from 'express';
import { addProduct, getProducts, deleteProduct, updateProduct } from '../controllers/productController.js';

const router = express.Router();

// Route to get all products
router.get('/', getProducts);

// Route to add a new product
router.post('/', addProduct);

// Route to update a product
router.put('/:id', updateProduct);

// Route to delete a product
router.delete('/:id', deleteProduct);

export default router;
