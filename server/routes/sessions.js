const express = require("express");
const router = express.Router();
const TherapySession = require("../models/TherapySession");
const User = require("../models/User");

// =============================
// GET /sessions
// =============================
router.get("/", async (req, res) => {
  const { userId, role } = req.query;

  try {
    let sessions;

    if (role === "practitioner") {
      // Practitioner sees all sessions
      sessions = await TherapySession.find()
        .populate("patient", "name email")
        .sort({ date: 1, time: 1 });
    } else {
      // Patient sees only their sessions
      sessions = await TherapySession.find({ patient: userId })
        .populate("patient", "name email")
        .sort({ date: 1, time: 1 });
    }

    res.json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// =============================
// POST /sessions
// =============================
router.post("/", async (req, res) => {
  const { patientId, date, time } = req.body;

  if (!patientId || !date || !time) {
    return res.status(400).json({ msg: "Please provide patientId, date, and time" });
  }

  try {
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    const session = new TherapySession({
      patient: patientId,
      date,
      time,
      status: "booked",
    });

    await session.save();
    await session.populate("patient", "name email");

    res.json(session);
  } catch (err) {
    console.error("Error booking session:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
