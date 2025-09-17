const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// ---------------- Connect Database ----------------
connectDB();

// ---------------- Middleware ----------------
app.use(express.json());
app.use(cors());

// ---------------- Routes ----------------
app.use("/auth", require("./routes/auth"));
app.use("/therapy", require("./routes/therapy"));
app.use("/sessions", require("./routes/sessions"));
app.use("/api/dashboard", require("./routes/dashboard")); // ✅ Patient & Practitioner dashboards
app.use("/api/practitioner", require("./routes/practitioner")); // ✅ Practitioner patient management



// ---------------- Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

const sessionRoutes = require("./routes/sessions");
app.use("/sessions", sessionRoutes);


