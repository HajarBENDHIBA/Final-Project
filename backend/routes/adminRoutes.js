import express from "express";
import { getAdmin, updateAdminProfile } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAdmin);
router.put("/", protect, updateAdminProfile); 

export default router;
