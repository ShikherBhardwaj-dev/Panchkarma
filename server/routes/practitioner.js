const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TherapySession = require('../models/TherapySession');
const auth = require('../middleware/auth');
const practitionerAuth = require('../middleware/practitionerAuth');

// Get all patients for a practitioner
router.get('/patients', auth, practitionerAuth, async (req, res) => {
    try {
        console.log('Fetching patients for practitioner:', req.user._id);
        console.log('User data in token:', req.user);
        
        const patients = await User.find({ 
            userType: 'patient',
            assignedPractitioner: req.user._id 
        }).select('-password');
        
        console.log('Found patients:', patients.length);
        
        res.json({ success: true, patients });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get detailed patient information including sessions and progress
router.get('/patients/:patientId', auth, practitionerAuth, async (req, res) => {
    try {
        const patient = await User.findById(req.params.patientId).select('-password');
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        // Verify this patient is assigned to the practitioner
        if (patient.assignedPractitioner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const sessions = await TherapySession.find({ patientId: req.params.patientId });
        
        res.json({ 
            success: true, 
            patient,
            sessions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update patient progress and milestones
router.put('/patients/:patientId/progress', auth, practitionerAuth, async (req, res) => {
    try {
        const { milestones, notes, recommendations, progress } = req.body;
        const patient = await User.findById(req.params.patientId);
        
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        // Verify this patient is assigned to the practitioner
        if (patient.assignedPractitioner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Persist progress on the User document if provided
        if (typeof progress !== 'undefined') {
            const p = Number(progress);
            if (!isNaN(p) && p >= 0 && p <= 100) {
                patient.progress = p;
                await patient.save();
            }
        }

        // Update a representative session document (if you want to keep notes/milestones tied to sessions)
        const session = await TherapySession.findOneAndUpdate(
            { patientId: req.params.patientId },
            { 
                $set: { 
                    milestones,
                    'practitionerNotes.progress': notes,
                    recommendations
                }
            },
            { new: true }
        );

        // Return the updated patient and the session for convenience
        res.json({ success: true, patient, session });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add practitioner notes to a session
router.post('/sessions/:sessionId/notes', auth, practitionerAuth, async (req, res) => {
    try {
        const { notes, recommendations } = req.body;
        const session = await TherapySession.findById(req.params.sessionId);
        
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        // Verify the patient is assigned to this practitioner
        const patient = await User.findById(session.patientId);
        if (patient.assignedPractitioner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        session.practitionerNotes = {
            ...session.practitionerNotes,
            sessionNotes: notes
        };
        session.recommendations = recommendations;
        await session.save();

        res.json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;