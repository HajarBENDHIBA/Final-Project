import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, role = "user" } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

        // Set cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: true, // Always use secure in production
            sameSite: 'none', // Required for cross-origin cookies
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/',
        };

        res.cookie("token", token, cookieOptions);

        res.json({
            message: "Logged in successfully",
            user: { id: user._id, username: user.username, email: user.email, role: user.role },
            token: token // Send token in response for client storage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Logout Route
router.post("/logout", (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;

