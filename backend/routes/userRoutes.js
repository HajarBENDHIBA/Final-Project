import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController.js'; 

const router = express.Router();

// Route to get all users
router.get('/users', getAllUsers);

// Route to delete a user
router.delete('/users/:userId', deleteUser);

export default router;