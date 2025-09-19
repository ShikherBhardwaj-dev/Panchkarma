const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ======================
// Signup Route
// ======================
router.post("/signup", async (req, res) => {
  const { name, email, password, phone, userType } = req.body;

  try {
    // check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // create new user
    const user = new User({
      name,
      email,
      phone,
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
      userType: user.userType,
      email: user.email,
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
  const { email, password } = req.body;

  try {
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

    // return user info (include _id so frontend can schedule sessions)
    res.json({
      success: true,
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

module.exports = router;

