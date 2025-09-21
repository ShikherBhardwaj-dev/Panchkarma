import express from 'express';
import TherapySession from '../models/TherapySession.js';
import User from '../models/User.js';

const router = express.Router();

// --- Panchakarma Therapy Templates ---
// Single Panchkarma template: 5 days Pre, 5 days Main, 5 days Post (total 15 days)
const therapyTemplates = {
  Panchkarma: [
    // Pre-treatment phase (5 days)
    { phase: "Pre", name: "Pre-Treatment (Snehana/Swedana)", days: 5, durationMins: 60 },
    // Main Panchakarma procedures (5 days)
    { phase: "Main", name: "Panchakarma Main Procedure", days: 5, durationMins: 180 },
    // Post-treatment recovery (5 days)
    { phase: "Post", name: "Post-Treatment Recovery", days: 5, durationMins: 30 },
  ],
};

// ✅ Practitioner creates custom free slots (your existing logic)
router.post("/create", async (req, res) => {
  try {
    const { practitioner, date, times } = req.body;
    const practitionerUser = await User.findOne({ email: practitioner });

    if (!practitionerUser) {
      return res.status(404).json({ error: "Practitioner not found" });
    }

    const slots = times.map((time) => ({
      practitioner: practitionerUser._id,
      date: new Date(date),
      startTime: time,
      durationMins: 60,
      therapyType: "Custom",
      phase: "Pre",
      sessionName: "General Slot",
    }));

    await TherapySession.insertMany(slots);
    res.json({ message: "Slots created successfully" });
  } catch (err) {
    console.error("Error creating slots:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Auto-generate therapy schedule
router.post("/autogenerate", async (req, res) => {
  try {
    const { practitionerEmail, patientEmail, therapyType, startDate } = req.body;

    const practitioner = await User.findOne({ email: practitionerEmail });
    const patient = await User.findOne({ email: patientEmail });

    if (!practitioner || !patient) {
      return res.status(404).json({ error: "Practitioner or patient not found" });
    }
    if (!therapyTemplates[therapyType]) {
      return res.status(400).json({ error: "Invalid therapy type" });
    }

    let currentDate = new Date(startDate);
    const sessions = [];

    therapyTemplates[therapyType].forEach((step) => {
      for (let i = 0; i < step.days; i++) {
        sessions.push({
          practitioner: practitioner._id,
          patient: patient._id,
          therapyType,
          phase: step.phase,
          sessionName: step.name,
          date: new Date(currentDate),
          startTime: "09:00", // default, can be edited later
          durationMins: step.durationMins,
          isBooked: true,
        });
        currentDate.setDate(currentDate.getDate() + 1); // move to next day
      }
    });

    await TherapySession.insertMany(sessions);
    res.json({ message: "Therapy schedule created", sessions });
  } catch (err) {
    console.error("Error auto-generating schedule:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Convenience endpoint: autogenerate a 15-day Panchkarma schedule
router.post('/autogenerate-panchkarma', async (req, res) => {
  try {
    const { practitionerEmail, patientEmail, startDate } = req.body;
    const practitioner = await User.findOne({ email: practitionerEmail });
    const patient = await User.findOne({ email: patientEmail });

    if (!practitioner || !patient) {
      return res.status(404).json({ error: 'Practitioner or patient not found' });
    }

    const therapyType = 'Panchkarma';
    let currentDate = startDate ? new Date(startDate) : new Date();
    // normalize to start of day
    currentDate.setHours(9,0,0,0);

    const sessions = [];
    therapyTemplates[therapyType].forEach((step) => {
      for (let i = 0; i < step.days; i++) {
        sessions.push({
          practitioner: practitioner._id,
          patient: patient._id,
          therapyType,
          phase: step.phase,
          sessionName: step.name,
          date: new Date(currentDate),
          startTime: '09:00',
          durationMins: step.durationMins,
          isBooked: true,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    await TherapySession.insertMany(sessions);
    res.json({ message: 'Panchkarma schedule created', sessions });
  } catch (err) {
    console.error('Error creating Panchkarma schedule:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get available slots (patients)
router.get("/available", async (req, res) => {
  try {
    const slots = await TherapySession.find({ isBooked: false })
      .populate("practitioner", "name email userType");
    res.json(slots);
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get patient’s booked sessions
router.get("/my-slots/:email", async (req, res) => {
  try {
    const patient = await User.findOne({ email: req.params.email });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const slots = await TherapySession.find({ patient: patient._id })
      .populate("practitioner", "name email userType");
    res.json(slots);
  } catch (err) {
    console.error("Error fetching patient slots:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get practitioner’s sessions
router.get("/practitioner-slots/:email", async (req, res) => {
  try {
    const practitioner = await User.findOne({ email: req.params.email });
    if (!practitioner) return res.status(404).json({ error: "Practitioner not found" });

    const slots = await TherapySession.find({ practitioner: practitioner._id })
      .populate("patient", "name email userType");
    res.json(slots);
  } catch (err) {
    console.error("Error fetching practitioner slots:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Book a free slot (patient)
router.post("/book/:id", async (req, res) => {
  try {
    const { patientEmail } = req.body;
    const patientUser = await User.findOne({ email: patientEmail });
    if (!patientUser) return res.status(404).json({ error: "Patient not found" });

    const slot = await TherapySession.findById(req.params.id);
    if (!slot) return res.status(404).json({ error: "Slot not found" });

    if (slot.isBooked) return res.status(400).json({ error: "Slot already booked" });

    slot.isBooked = true;
    slot.patient = patientUser._id;
    await slot.save();

    res.json({ message: "Slot booked successfully" });
  } catch (err) {
    console.error("Error booking slot:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Practitioner edits a session
router.put("/edit/:id", async (req, res) => {
  try {
    const { date, startTime, durationMins, notes } = req.body;
    const updatedSlot = await TherapySession.findByIdAndUpdate(
      req.params.id,
      { date, startTime, durationMins, notes },
      { new: true }
    );
    if (!updatedSlot) return res.status(404).json({ error: "Session not found" });
    res.json({ message: "Session updated", updatedSlot });
  } catch (err) {
    console.error("Error editing session:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete a slot (only if not booked)
router.delete("/delete/:id", async (req, res) => {
  try {
    const slot = await TherapySession.findById(req.params.id);
    if (!slot) return res.status(404).json({ error: "Slot not found" });

    if (slot.isBooked) {
      return res.status(400).json({ error: "Cannot delete a booked slot" });
    }

    await TherapySession.findByIdAndDelete(req.params.id);
    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    console.error("Error deleting slot:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update session status
router.put("/sessions/:sessionId/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["scheduled", "in-progress", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const session = await TherapySession.findByIdAndUpdate(
      req.params.sessionId,
      { status },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Status updated successfully", session });
  } catch (err) {
    console.error("Error updating session status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

