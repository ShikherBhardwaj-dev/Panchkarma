const express = require("express");
const router = express.Router();
const TherapySession = require("../models/TherapySession");
const User = require("../models/User");

// -------------------- GET all sessions --------------------
router.get("/", async (req, res) => {
  const { userId, role } = req.query;

  try {
    let sessions;

    if (role === "practitioner") {
      sessions = await TherapySession.find()
        .populate("patient", "name email")
        .sort({ date: 1, startTime: 1 });
    } else {
      // Patient sees only their sessions
      const patient = await User.findOne({ email: userId });
      if (!patient) return res.status(404).json({ msg: "Patient not found" });

      sessions = await TherapySession.find({ patient: patient._id })
        .populate("patient", "name email")
        .sort({ date: 1, startTime: 1 });
    }

    res.json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- POST: Generate full therapy schedule --------------------
router.post("/", async (req, res) => {
  const { patientId, therapyType, startDate, slotTimes } = req.body;

  if (!patientId || !therapyType || !startDate) {
    return res.status(400).json({ msg: "Please provide patientId, therapyType, and startDate" });
  }

  try {
    // Find patient by email
    const patient = await User.findOne({ email: patientId });
    if (!patient) return res.status(404).json({ msg: "Patient not found" });

    // Panchakarma schedule template
    const therapyTemplate = {
      Virechana: [
        { phase: "Pre", sessionName: "Preparation 1", daysAfterStart: 0 },
        { phase: "Pre", sessionName: "Preparation 2", daysAfterStart: 1 },
        { phase: "Main", sessionName: "Virechana Procedure", daysAfterStart: 2 },
        { phase: "Post", sessionName: "Dietary Follow-up", daysAfterStart: 3 },
        { phase: "Post", sessionName: "Check-up", daysAfterStart: 4 },
      ],
      Vamana: [
        { phase: "Pre", sessionName: "Preparation 1", daysAfterStart: 0 },
        { phase: "Main", sessionName: "Vamana Procedure", daysAfterStart: 1 },
        { phase: "Post", sessionName: "Dietary Follow-up", daysAfterStart: 2 },
        { phase: "Post", sessionName: "Check-up", daysAfterStart: 3 },
      ],
    };

    const template = therapyTemplate[therapyType];
    if (!template) return res.status(400).json({ msg: "Invalid therapyType" });

    // slotTimes: optional array of start times for each session
    const sessions = await Promise.all(template.map(async (item, idx) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + item.daysAfterStart);
      const sessionDate = date.toISOString().split("T")[0];
      const startTime = slotTimes && slotTimes[idx] ? slotTimes[idx] : "10:00";

      // Conflict check: is there already a session at this date/time?
      const conflict = await TherapySession.findOne({ date: sessionDate, startTime });
      if (conflict) {
        throw new Error(`Slot conflict on ${sessionDate} at ${startTime}`);
      }

      return {
        patient: patient._id,
        therapyType,
        phase: item.phase,
        sessionName: item.sessionName,
        date: sessionDate,
        startTime,
        status: "Scheduled",
      };
    }));

    const createdSessions = await TherapySession.insertMany(sessions);

    res.json(createdSessions);
  } catch (err) {
    console.error("Error generating therapy schedule:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
});

// -------------------- PUT: Edit session --------------------
router.put("/edit/:id", async (req, res) => {
  try {
    const { date, startTime, notes, userId, userType } = req.body;
    const session = await TherapySession.findById(req.params.id).populate('patient');
    if (!session) return res.status(404).json({ msg: "Session not found" });

    // Authorization check
    if (userType === 'patient' && session.patient.email !== userId) {
      return res.status(403).json({ msg: "Not authorized to edit this session" });
    }

    // Conflict check for new date/time
    if (date && startTime) {
      const conflict = await TherapySession.findOne({ date, startTime, _id: { $ne: session._id } });
      if (conflict) {
        return res.status(400).json({ msg: `Slot conflict on ${date} at ${startTime}` });
      }
      session.date = date;
      session.startTime = startTime;
    } else {
      if (date) session.date = date;
      if (startTime) session.startTime = startTime;
    }
    if (notes) session.notes = notes;

    await session.save();
    res.json({ msg: "Session updated", session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
});

// -------------------- DELETE: Cancel session --------------------
router.delete("/delete/:id", async (req, res) => {
  try {
    const { userId, userType } = req.query;
    const session = await TherapySession.findById(req.params.id).populate('patient');
    if (!session) return res.status(404).json({ msg: "Session not found" });

    // Authorization check
    if (userType === 'patient' && session.patient.email !== userId) {
      return res.status(403).json({ msg: "Not authorized to delete this session" });
    }

    await session.deleteOne(); // Using deleteOne() instead of remove()
    res.json({ msg: "Session cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
});

module.exports = router;



