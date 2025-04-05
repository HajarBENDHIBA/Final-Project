import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from './routes/userRoutes.js'; 
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';  // Import this for ES module support
import bcrypt from 'bcryptjs';

dotenv.config();
const app = express();

// Handle static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  // Workaround for __dirname in ES module

// Ensure required environment variables exist
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing required environment variables. Check your .env file.");
  process.exit(1);
}

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Increase the limit for body-parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// JWT Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || (req.headers["authorization"]?.split(" ")[1] ?? null);

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  });
};

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Get User Profile
app.get("/api/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update User Profile
app.put("/api/user/update", verifyToken, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email) return res.status(400).json({ message: "Username and email are required." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format." });

    const updateData = { username, email };
    
    // Only update password if it's provided
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, select: "username email" }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, 
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
