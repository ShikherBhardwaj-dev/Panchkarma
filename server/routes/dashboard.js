const express = require("express");
const router = express.Router();
const TherapySession = require("../models/TherapySession");
const User = require("../models/User");

// -------------------- PATIENT DASHBOARD --------------------
router.get("/patient/:id", async (req, res) => {
  try {
    const patientId = req.params.id;

    // Find sessions booked by this patient
    const sessions = await TherapySession.find({ patient: patientId });

    const completed = sessions.filter((s) => s.isBooked).length;
    const total = sessions.length;

    res.json({
      completed,
      total,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      wellnessScore: 8.2, // fake static value for now
      nextSession:
        sessions.length > 0
          ? `${sessions[0].date} ${sessions[0].time}`
          : "No upcoming session",
      nextMilestone: "Mid-therapy Assessment",
      notifications: [
        { id: 1, message: "Your next session is coming up!" },
        { id: 2, message: "Don’t forget to track your wellness." },
      ],
    });
  } catch (err) {
    console.error("Patient dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- PRACTITIONER DASHBOARD --------------------
router.get("/practitioner/:id", async (req, res) => {
  try {
    const practitionerId = req.params.id;

    // Find all sessions created by this practitioner
    const appointments = await TherapySession.find({
      practitioner: practitionerId,
    }).populate("patient");

    // Extract unique patients
    const patientIds = [
      ...new Set(appointments.map((a) => a.patient?._id).filter(Boolean)),
    ];
    const patients = await User.find({ _id: { $in: patientIds } });

    // Upcoming sessions (future dates)
    const upcomingPatients = appointments.filter(
      (a) => new Date(a.date) > new Date()
    );

    res.json({
      totalPatients: patients.length,
      upcomingPatients,
    });
  } catch (err) {
    console.error("Practitioner dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
