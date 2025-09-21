const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/default.json");
const passport = require("passport");

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

    // basic input validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // derive a fallback name if not provided
    let derivedName = name && String(name).trim();
    if (!derivedName && email) {
      const local = String(email).split("@")[0] || "user";
      derivedName = local
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
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
      } else if (
        digits.length >= 11 &&
        digits.startsWith("91") &&
        digits.length <= 13
      ) {
        phoneFormatted = `+${digits}`;
      } else if (String(phone).startsWith("+")) {
        phoneFormatted = phone;
      } else {
        // fallback: keep raw input
        phoneFormatted = phone;
      }
    }

    const user = new User({
      name: derivedName,
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
      },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ msg: "Server error" });
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

    // Sign JWT and return token + user info
    const payload = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiration || "24h",
    });

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
    res.status(500).json({ msg: "Server error" });
  }
});

// ======================
// Get All Patients (for practitioners)
// ======================
router.get("/patients", async (req, res) => {
  try {
    const patients = await User.find({ userType: "patient" }).select(
      "name email _id"
    );
    res.json(patients);
  } catch (err) {
    console.error("Fetch patients error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// ======================
// Get All Practitioners (for patients)
// ======================
router.get("/practitioners", async (req, res) => {
  try {
    const practitioners = await User.find({ userType: "practitioner" }).select(
      "name email _id phone"
    );
    res.json(practitioners);
  } catch (err) {
    console.error("Fetch practitioners error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// ======================
// Google OAuth Routes
// ======================

// Google OAuth login initiation
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login?error=google_auth_failed",
  }),
  async (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const payload = {
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          userType: req.user.userType,
        },
      };
      const token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiration || "24h",
      });

      // Redirect to frontend with token and user data
      const userData = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        userType: req.user.userType,
        provider: req.user.provider,
      };

      // Encode user data and token for URL
      const encodedUserData = encodeURIComponent(JSON.stringify(userData));
      const encodedToken = encodeURIComponent(token);

      res.redirect(
        `http://localhost:3000/?token=${encodedToken}&user=${encodedUserData}&auth=google`
      );
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect("http://localhost:3000/login?error=google_auth_failed");
    }
  }
);

// Google OAuth success endpoint (for API calls)
router.get("/google/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        userType: req.user.userType,
        provider: req.user.provider,
      },
    });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
});

module.exports = router;
