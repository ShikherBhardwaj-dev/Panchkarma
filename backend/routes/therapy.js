const express = require("express");
const router = express.Router();
const TherapySession = require("../models/TherapySession");
const User = require("../models/User");

// ✅ Create slots (practitioner)
router.post("/create", async (req, res) => {
  try {
    const { practitioner, date, times } = req.body;
    const practitionerUser = await User.findOne({ email: practitioner });

    if (!practitionerUser) {
      return res.status(404).json({ error: "Practitioner not found" });
    }

    const slots = times.map((time) => ({
      practitioner: practitionerUser._id,
      date,
      time,
    }));

    await TherapySession.insertMany(slots);
    res.json({ message: "Slots created successfully" });
  } catch (err) {
    console.error("Error creating slots:", err);
    res.status(500).json({ error: "Server error" });
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

// ✅ Get patient’s booked slots
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

// ✅ Get practitioner’s slots
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

// ✅ Book a slot (patient)
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

// ✅ Delete a slot (practitioner only, if not booked)
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

module.exports = router;
