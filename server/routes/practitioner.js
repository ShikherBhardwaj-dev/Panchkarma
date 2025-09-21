import express from 'express';
import User from '../models/User.js';
import TherapySession from '../models/TherapySession.js';
import auth from '../middleware/auth.js';
import practitionerAuth from '../middleware/practitionerAuth.js';

const router = express.Router();

// Assign patient to practitioner
router.post('/assign-patient', auth, practitionerAuth, async (req, res) => {
    try {
        const { patientId } = req.body;
        const patient = await User.findById(patientId);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        patient.assignedPractitioner = req.user._id;
        await patient.save();

        res.json({ success: true, message: 'Patient assigned successfully' });
    } catch (error) {
        console.error('Error assigning patient:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

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
            // If patient has an assignedPractitioner, only that practitioner may edit; if not assigned, permit practitioner edits.
            if (patient.assignedPractitioner && patient.assignedPractitioner.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success: false, message: 'Not authorized' });
            }

            // Fetch sessions for this patient (TherapySession uses `patient` field)
            const sessions = await TherapySession.find({ patient: req.params.patientId }).populate('patient', 'name email').sort({ date: 1, startTime: 1 });
        
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
        console.log('PUT /api/practitioner/patients/:patientId/progress called by', req.user && req.user._id);
        console.log('Request body:', JSON.stringify(req.body).slice(0, 1000));
        const { milestones, notes, recommendations, progress, practitionerNotes, currentStage, treatmentStartDate, medicalHistory } = req.body;
        const patient = await User.findById(req.params.patientId);
        
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        // During development, allow any practitioner to edit any patient
        console.log('[DEBUG] Auth check:', {
            patientId: patient._id,
            assignedPractitioner: patient.assignedPractitioner,
            requestingPractitioner: req.user._id,
            userType: req.user.userType
        });

        // Persist editable fields on the User document if provided
        let changed = false;
        if (typeof progress !== 'undefined') {
            const p = Number(progress);
            if (!isNaN(p) && p >= 0 && p <= 100) {
                patient.progress = p;
                changed = true;
            }
        }
        if (typeof practitionerNotes !== 'undefined') {
            patient.practitionerNotes = practitionerNotes;
            changed = true;
        }
        if (typeof recommendations !== 'undefined') {
            patient.recommendations = recommendations;
            changed = true;
        }
        if (typeof currentStage !== 'undefined') {
            patient.currentStage = currentStage;
            changed = true;
        }
        if (typeof treatmentStartDate !== 'undefined' && treatmentStartDate) {
            const dt = new Date(treatmentStartDate);
            if (!isNaN(dt.getTime())) {
                patient.treatmentStartDate = dt;
                changed = true;
            }
        }
        if (typeof medicalHistory !== 'undefined') {
            // Expecting an object like { conditions: [], medications: [], allergies: [] }
            patient.medicalHistory = { ...patient.medicalHistory, ...medicalHistory };
            changed = true;
        }
        if (changed) await patient.save();

        // Update a representative session document (if you want to keep notes/milestones tied to sessions)
        // Update a representative session document (if you want to keep notes/milestones tied to sessions)
        const sessionUpdate = {
            ...(typeof milestones !== 'undefined' ? { milestones } : {}),
            ...(typeof notes !== 'undefined' ? { 'practitionerNotes.progress': notes } : {}),
            ...(typeof recommendations !== 'undefined' ? { recommendations } : {})
        };
        const session = await TherapySession.findOneAndUpdate(
            { patientId: req.params.patientId },
            { $set: sessionUpdate },
            { new: true }
        );

        // Return the updated patient and the session for convenience
        console.log('[DEBUG] Successfully updated patient progress:', {
            patientId: patient._id,
            updatedProgress: patient.progress,
            updatedStage: patient.currentStage,
            sessionId: session?._id
        });
        res.json({ success: true, patient, session });
    } catch (error) {
        console.error('[ERROR] Failed to update patient progress:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Add practitioner notes to a session
router.post('/sessions/:sessionId/notes', auth, practitionerAuth, async (req, res) => {
    try {
        console.log('POST /api/practitioner/sessions/:sessionId/notes called by', req.user && req.user._id);
        console.log('Request body:', JSON.stringify(req.body).slice(0, 1000));
        const { notes, recommendations } = req.body;
        const session = await TherapySession.findById(req.params.sessionId);
        
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        // Verify the patient is assigned to this practitioner if assignment exists
        const patient = await User.findById(session.patientId);
        if (patient.assignedPractitioner && patient.assignedPractitioner.toString() !== req.user._id.toString()) {
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

export default router;