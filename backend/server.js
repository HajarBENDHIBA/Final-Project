import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import path from "path";
import { fileURLToPath } from "url"; // Import this for ES module support
import bcrypt from "bcryptjs";

const app = express();

// Handle static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Workaround for __dirname in ES module

// Define allowed origins explicitly
const allowedOrigins = [
  "http://localhost:3000",
  "https://backend-green-heaven.vercel.app",
  "https://green-heaven-final.vercel.app",
  "https://backend-green-heaven-git-main-hajar-bendhibas-projects.vercel.app",
];

// CORS Configuration - Must be before other middleware
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming request from origin:", origin);

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log("No origin specified - allowing request");
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) === -1) {
        console.log("Origin not allowed:", origin);
        const msg = `CORS Error: The origin ${origin} is not allowed`;
        return callback(new Error(msg), false);
      }

      console.log("Origin allowed:", origin);
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-CSRF-Token",
    ],
    exposedHeaders: ["Content-Length", "X-CSRF-Token"],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// Additional security headers
app.use((req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  next();
});

// Parse JSON bodies with increased limits
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// JWT Middleware to verify token with debugging
const verifyToken = (req, res, next) => {
  console.log("Verifying token...");
  console.log("Cookies:", req.cookies);
  console.log("Authorization header:", req.headers.authorization);

  const token =
    req.cookies.token || (req.headers.authorization?.split(" ")[1] ?? null);

  if (!token) {
    console.log("No token found");
    return res
      .status(401)
      .json({ message: "Please log in to access this resource." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// Add a root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Green Heaven API" });
});

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
    if (!username || !email)
      return res
        .status(400)
        .json({ message: "Username and email are required." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format." });

    const updateData = { username, email };

    // Only update password if it's provided
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      select: "username email",
    });

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Maximum number of connections in the pool
    minPoolSize: 2, // Minimum number of connections in the pool
    serverSelectionTimeoutMS: 5000, // Timeout for server selection
    socketTimeoutMS: 45000, // How long to wait for operations to complete
    family: 4, // Use IPv4, skip trying IPv6
  })
  .then(() => {
    console.log("Connected to MongoDB");
    console.log(`MongoDB connection state: ${mongoose.connection.readyState}`);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", {
      error: err.message,
      name: err.name,
      code: err.code,
    });
    process.exit(1);
  });

// Monitor MongoDB connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error event:", {
    error: err.message,
    name: err.name,
    code: err.code,
  });
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected successfully");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
}

// Export the Express API
export default app;
