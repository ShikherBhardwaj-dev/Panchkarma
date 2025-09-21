// Load environment variables from .env when present (development)
require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const passport = require('./config/passport');
const session = require('express-session');

const app = express();

// ---------------- Connect Database ----------------
connectDB();

// ---------------- Middleware ----------------
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'ayursutra-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ---------------- Routes ----------------
app.use("/api/auth", require("./routes/auth"));
// Legacy auth routes for Google OAuth callback compatibility
app.use("/auth", require("./routes/auth"));
app.use("/therapy", require("./routes/therapy"));
app.use("/sessions", require("./routes/sessions"));
app.use("/api/dashboard", require("./routes/dashboard")); // ✅ Patient & Practitioner dashboards
app.use("/api/chat", require("./routes/chatRoutes")); // ✅ AI Chatbot route
app.use("/api/practitioner", require("./routes/practitioner")); // ✅ Practitioner patient management
app.use("/api/practitioner-search", require("./routes/practitionerSearch")); // ✅ Practitioner search and assignment
app.use("/api/profile", require("./routes/profile")); // ✅ Profile management
app.use("/api/verification", require("./routes/verification")); // ✅ Practitioner verification
// New messaging and notification routes
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
// Admin / debug endpoints (test WhatsApp send, list recent notifications)
app.use('/admin', require('./routes/adminNotifications'));

// Debug routes (temporary, for auth debugging)
app.use('/debug', require('./routes/debugRoutes'));

// Start notification worker (sends email/SMS/in-app reminders)
const { startNotificationWorker } = require('./workers/notificationWorker');
startNotificationWorker();

// ---------------- Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


