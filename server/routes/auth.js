import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = JSON.parse(readFileSync(join(dirname(__dirname), 'config', 'default.json'), 'utf-8'));
const router = express.Router();

// ======================
// Signup Route
// ======================
router.post("/signup", async (req, res) => {
  let { name, email, password, phone, userType } = req.body;

  // Normalize email for storage to avoid case-mismatch between signup/login
  if (email) email = String(email).trim().toLowerCase();

  try {
    // check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // create new user
    // Normalize phone: remove non-digit chars and try to format to E.164
    let phoneFormatted = null;
    if (phone) {
      const digits = String(phone).replace(/\D/g, "");
      if (digits.length === 10) {
        // assume local India number -> +91
        phoneFormatted = `+91${digits}`;
      } else if (digits.length === 11 && digits.startsWith("0")) {
        // leading 0, drop and assume +91
        phoneFormatted = `+91${digits.slice(1)}`;
      } else if (digits.length >= 11 && digits.startsWith("91") && digits.length <= 13) {
        phoneFormatted = `+${digits}`;
      } else if (String(phone).startsWith("+")) {
        phoneFormatted = phone;
      } else {
        // fallback: keep raw input
        phoneFormatted = phone;
      }
    }

    const user = new User({
      name,
      email,
      phone: phoneFormatted,
      userType, // ✅ store userType (patient/practitioner)
    });

    // hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save user
    await user.save();

    res.json({
      success: true,
      msg: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
      }
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ======================
// Login Route
// ======================
router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  try {
    // normalize email
    if (email) {
      email = email.trim().toLowerCase();
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Sign JWT and return token + user info
    const payload = { user: { _id: user._id, name: user.name, email: user.email, userType: user.userType } };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration || '24h' });

    res.json({
      success: true,
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ======================
// Get All Patients (for practitioners)
// ======================
router.get("/patients", async (req, res) => {
  try {
    const patients = await User.find({ userType: "patient" }).select("name email _id");
    res.json(patients);
  } catch (err) {
    console.error("Fetch patients error:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ======================
// Get All Practitioners (for patients)
// ======================
router.get("/practitioners", async (req, res) => {
  try {
    const practitioners = await User.find({ userType: "practitioner" }).select("name email _id phone");
    res.json(practitioners);
  } catch (err) {
    console.error("Fetch practitioners error:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;

