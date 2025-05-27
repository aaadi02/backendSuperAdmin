import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Create Super Admin
router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate password strength (example: minimum 8 characters)
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new super admin
    const newUser = new User({
      username,
      password: hashedPassword,
      role: "super_admin",
    });

    await newUser.save();
    res.status(201).json({ message: "Super Admin created successfully" });
  })
);

// Super Admin Login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check role
    if (user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  })
);

// GET route for Super Admin details
router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user || user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(user);
  })
);

export default router;
