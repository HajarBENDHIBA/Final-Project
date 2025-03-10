import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Order from "./models/Order.js";

dotenv.config();
const app = express();

// CORS configuration
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(",") : ["http://localhost:3000"];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// JWT Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || (req.headers["authorization"]?.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = decoded;  // Attach user info to the request object
    next();
  });
};

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api", authRoutes);
app.use("/api/orders", orderRoutes);

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
    const { username, email } = req.body;
    if (!username || !email) return res.status(400).json({ message: "Username and email are required." });
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format." });
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, select: "username email" }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Get User Orders
app.get('/api/orders/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`Fetching orders for user ID: ${userId}`);
    const orders = await Order.find({ userId });
    console.log("Orders found:", orders);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});


// Create Order
app.post("/api/orders", verifyToken, async (req, res) => {
  try {
    const { products, totalPrice, paymentDetails } = req.body;

    if (!products || !totalPrice || !paymentDetails) {
      return res.status(400).json({ message: "Products, total price, and payment details are required." });
    }

    const newOrder = new Order({
      userId: req.user.id, // Assign the logged-in user's ID to the order
      products,
      totalPrice,
      paymentDetails,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
