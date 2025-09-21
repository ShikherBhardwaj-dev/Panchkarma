import express from 'express';
import TherapySession from '../models/TherapySession.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import practitionerAuth from '../middleware/practitionerAuth.js';

const router = express.Router();

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

    // Therapy templates - support Panchkarma (15-day: 5 Pre, 5 Main, 5 Post)
    const therapyTemplate = {
      Panchkarma: Array.from({ length: 15 }).map((_, idx) => {
        if (idx < 5) return { phase: 'Pre', sessionName: `Pre-Treatment Day ${idx+1}`, daysAfterStart: idx };
        if (idx < 10) return { phase: 'Main', sessionName: `Main Panchakarma Day ${idx-4}`, daysAfterStart: idx };
        return { phase: 'Post', sessionName: `Post-Treatment Day ${idx-9}`, daysAfterStart: idx };
      })
    };

    const template = therapyTemplate[therapyType];
    if (!template) return res.status(400).json({ msg: "Invalid therapyType" });

    // slotTimes: optional array of start times for each session
    const sessions = await Promise.all(template.map(async (item, idx) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + item.daysAfterStart);
      const sessionDate = date.toISOString().split("T")[0];
      const startTime = slotTimes && slotTimes[idx] ? slotTimes[idx] : "10:00";

      // Skip creating sessions that would be in the past
      const sessionDateObj = new Date(sessionDate);
      if (sessionDateObj < new Date(new Date().setHours(0,0,0,0))) {
        // return null for past session entries so we can filter them out later
        return null;
      }

      // Conflict check: is there already a session at this date/time? Ignore cancelled
      const conflict = await TherapySession.findOne({
        date: sessionDate,
        startTime,
        status: { $ne: 'cancelled' }
      });
      if (conflict) {
        throw new Error(`Slot conflict on ${sessionDate} at ${startTime}`);
      }

      // Create new session with default practitioner
      let defaultPractitioner = await User.findOne({ userType: 'practitioner' });
      if (!defaultPractitioner) {
        defaultPractitioner = new User({
          name: "Default Practitioner",
          email: "default.practitioner@ayurveda.com",
          password: "defaultPass123",
          userType: "practitioner",
          status: "active"
        });
        await defaultPractitioner.save();
      }

      return {
        patient: patient._id,
        practitioner: defaultPractitioner._id,
        therapyType,
        phase: item.phase,
        sessionName: item.sessionName,
        date: sessionDate,
        startTime,
        status: 'scheduled', // Make sure this is lowercase
      };
    }));

    // Find a default practitioner
    let defaultPractitioner = await User.findOne({ userType: 'practitioner' });
    if (!defaultPractitioner) {
      // Create a default practitioner if none exists
      defaultPractitioner = new User({
        name: "Default Practitioner",
        email: "default.practitioner@ayurveda.com",
        password: "defaultPass123", // You should use proper password hashing in production
        userType: "practitioner",
        status: "active"
      });
      await defaultPractitioner.save();
    }

    // Filter out nulls (past sessions) and ensure practitioner/status are set
    const sessionsFiltered = sessions.filter(Boolean).map(session => ({
      ...session,
      practitioner: session.practitioner || defaultPractitioner._id,
      status: String(session.status || 'scheduled').toLowerCase()
    }));

    const createdSessions = await TherapySession.insertMany(sessionsFiltered);

    res.json(createdSessions);
  } catch (err) {
    console.error("Error generating therapy schedule:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
});

// -------------------- PUT: Update session --------------------
router.put("/:id", async (req, res) => {
  try {
    console.log('PUT /sessions/:id body =>', req.body);
    const { date, startTime, notes, userId, userType, status, sessionName, phase, therapyType } = req.body;
    const session = await TherapySession.findById(req.params.id).populate('patient');
    if (!session) return res.status(404).json({ msg: "Session not found" });

    // Authorization check
    if (userType === 'patient' && session.patient.email !== userId) {
      return res.status(403).json({ msg: "Not authorized to edit this session" });
    }

    // Preserve existing values if not provided
    if (sessionName) session.sessionName = sessionName;
    if (phase) session.phase = phase;
    if (therapyType) session.therapyType = therapyType;

    // Status update
    // Status update
    if (status) {
      // Normalize status (lowercase + trim) and log for debugging
      const normalizedStatus = String(status).toLowerCase().trim();
      console.log('Received status update:', status, '->', normalizedStatus);

      // If the update is a cancellation (accept common variants), perform a direct update
      // to avoid triggering full document validation. This allows cancelling even if
      // some required fields are missing on the stored document.
      if (normalizedStatus.startsWith('cancel')) {
        const updated = await TherapySession.findByIdAndUpdate(
          req.params.id,
          { $set: { status: 'cancelled' } },
          { new: true }
        ).populate('patient');

        if (!updated) return res.status(404).json({ msg: 'Session not found' });
        return res.json({ msg: 'Session updated', session: updated });
      }

      try {
        // For non-cancellation statuses, use the model setter which performs
        // normalization/validation.
        session.status = status;
      } catch (err) {
        console.error('Status validation error:', err);
        return res.status(400).json({ 
          msg: err.message,
          debug: { 
            receivedStatus: status,
            allowedValues: ['scheduled', 'completed', 'cancelled', 'in-progress']
          }
        });
      }

      // If session doesn't have a practitioner, assign a default one
      if (!session.practitioner) {
        let defaultPractitioner = await User.findOne({ userType: 'practitioner' });
        if (!defaultPractitioner) {
          // Create a default practitioner if none exists
          defaultPractitioner = new User({
            name: "Default Practitioner",
            email: "default.practitioner@ayurveda.com",
            password: "defaultPass123", // You should use proper password hashing in production
            userType: "practitioner",
            status: "active"
          });
          await defaultPractitioner.save();
        }
        session.practitioner = defaultPractitioner._id;
      }

      session.status = String(status).toLowerCase();
    }

    // Date/Time update (reschedule): perform safe partial update to avoid full
    // document validation (which can fail when other required fields are missing).
    if (date || startTime) {
      try {
        // If cancelling, we handled above. For rescheduling, validate inputs.
        // Only check conflicts for rescheduling.
        if (date && startTime) {
          const conflict = await TherapySession.findOne({
            date,
            startTime,
            _id: { $ne: session._id },
            status: { $ne: 'cancelled' }
          });
          if (conflict) {
            return res.status(400).json({ msg: `Slot conflict on ${date} at ${startTime}` });
          }

          // Validate the date
          if (new Date(date) < new Date(new Date().setHours(0,0,0,0))) {
            return res.status(400).json({ msg: 'Cannot schedule session in the past' });
          }
        }

        // Validate time format if provided
        if (startTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime)) {
          return res.status(400).json({ msg: 'Invalid time format. Use HH:MM' });
        }

        // Build the $set object only with scheduling fields
        const setObj = {};
        if (date) setObj.date = new Date(date);
        if (startTime) setObj.startTime = startTime;

        // Perform a partial update (no validation of other fields)
        const updated = await TherapySession.findByIdAndUpdate(
          req.params.id,
          { $set: setObj },
          { new: true }
        ).populate('patient');

        if (!updated) return res.status(404).json({ msg: 'Session not found' });
        return res.json({ msg: 'Session rescheduled', session: updated });
      } catch (err) {
        console.error('Error updating session date/time:', err);
        return res.status(500).json({ msg: err.message || 'Error updating session' });
      }
    }

    // Notes update
    if (notes) session.notes = notes;

    try {
      const updatedSession = await session.save();
      res.json({ 
        msg: "Session updated", 
        session: updatedSession,
        debug: {
          originalStatus: status,
          finalStatus: updatedSession.status
        }
      });
    } catch (err) {
      console.error('Error saving session:', err);
      return res.status(400).json({ 
        msg: err.message || 'Failed to update session',
        debug: {
          receivedStatus: status,
          normalizedStatus: session.status,
          validStatuses: ['scheduled', 'completed', 'cancelled', 'in-progress']
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
});

// -------------------- PUT: Practitioner-only: Update session status --------------------
// Simple endpoint for practitioners to mark a session completed/incomplete and
// optionally sync the patient's overall progress on the User document.
router.put('/:id/status', auth, practitionerAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ msg: 'Please provide status' });

    const session = await TherapySession.findById(req.params.id).populate('patient');
    if (!session) return res.status(404).json({ msg: 'Session not found' });

    // Verify the patient is assigned to this practitioner
    if (!session.patient || !session.patient.assignedPractitioner || session.patient.assignedPractitioner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Not authorized to modify this session' });
    }

    // Normalize status
    const normalized = String(status).toLowerCase().trim();
    if (!['scheduled', 'completed', 'cancelled', 'in-progress'].includes(normalized)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    session.status = normalized;
    await session.save();

    // If session marked completed, optionally update patient's progress percentage
    if (normalized === 'completed') {
      try {
        // Recompute patient's completed / total sessions to derive a progress percent
        const total = await TherapySession.countDocuments({ patient: session.patient._id, status: { $ne: 'cancelled' } });
        const completed = await TherapySession.countDocuments({ patient: session.patient._id, status: 'completed' });
        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

        const patient = await User.findById(session.patient._id);
        if (patient) {
          patient.progress = pct;
          await patient.save();
        }
      } catch (err) {
        console.warn('Failed to sync patient progress after session completion', err.message);
      }
    }

    return res.json({ msg: 'Session status updated', session });
  } catch (err) {
    console.error('Error updating session status by practitioner:', err);
    return res.status(500).json({ msg: err.message || 'Server error' });
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

export default router;



