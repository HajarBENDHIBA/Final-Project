import Admin from "../models/User.js";
import bcrypt from "bcryptjs";

// Get Admin Data
export const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select("-password"); 
        if (!admin || admin.role !== "admin") return res.status(404).json({ message: "Admin not found" });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);

        if (!admin || admin.role !== "admin") {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (req.body.username) {
            admin.username = req.body.username;  
        }

        if (req.body.email) {
            admin.email = req.body.email;
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedAdmin = await admin.save();
        res.json({
            _id: updatedAdmin._id,
            username: updatedAdmin.username,  
            email: updatedAdmin.email,
            role: updatedAdmin.role,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
