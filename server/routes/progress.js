const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const practitionerAuth = require("../middleware/practitionerAuth");

// ======================
// Get Patient Progress (for practitioners)
// ======================
router.get("/patient/:patientId", auth, practitionerAuth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const practitionerId = req.user._id;

    // Verify the patient is assigned to this practitioner
    const patient = await User.findOne({
      _id: patientId,
      userType: 'patient',
      assignedPractitioner: practitionerId
    }).select('-password');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found or not assigned to you'
      });
    }

    res.json({
      success: true,
      patient: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        progress: patient.progress || 0,
        currentStage: patient.currentStage || 'Initial Assessment',
        status: patient.status || 'pending',
        personalDetails: patient.personalDetails || {},
        progressHistory: patient.progressHistory || [],
        lastUpdated: patient.updatedAt
      }
    });
  } catch (error) {
    console.error('Get patient progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ======================
// Update Patient Progress (for practitioners)
// ======================
router.put("/patient/:patientId", auth, practitionerAuth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const practitionerId = req.user._id;
    const {
      progress,
      currentStage,
      status,
      notes,
      recommendations,
      nextSessionDate,
      wellnessScore
    } = req.body;

    // Verify the patient is assigned to this practitioner
    const patient = await User.findOne({
      _id: patientId,
      userType: 'patient',
      assignedPractitioner: practitionerId
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found or not assigned to you'
      });
    }

    // Create progress history entry
    const progressEntry = {
      date: new Date(),
      progress: progress || patient.progress || 0,
      stage: currentStage || patient.currentStage || 'Initial Assessment',
      status: status || patient.status || 'pending',
      notes: notes || '',
      recommendations: recommendations || '',
      updatedBy: practitionerId,
      updatedByName: req.user.name
    };

    // Update patient progress
    const updateData = {};
    if (progress !== undefined) updateData.progress = progress;
    if (currentStage !== undefined) updateData.currentStage = currentStage;
    if (status !== undefined) updateData.status = status;
    if (wellnessScore !== undefined) updateData.wellnessScore = wellnessScore;
    if (nextSessionDate !== undefined) updateData.nextSessionDate = nextSessionDate;

    // Add to progress history
    if (!patient.progressHistory) {
      updateData.progressHistory = [progressEntry];
    } else {
      updateData.progressHistory = [...patient.progressHistory, progressEntry];
    }

    const updatedPatient = await User.findByIdAndUpdate(
      patientId,
      { $set: updateData },
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      message: 'Progress updated successfully',
      patient: {
        _id: updatedPatient._id,
        name: updatedPatient.name,
        progress: updatedPatient.progress,
        currentStage: updatedPatient.currentStage,
        status: updatedPatient.status,
        progressHistory: updatedPatient.progressHistory
      }
    });
  } catch (error) {
    console.error('Update patient progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ======================
// Get All Assigned Patients Progress (for practitioners)
// ======================
router.get("/patients", auth, practitionerAuth, async (req, res) => {
  try {
    const practitionerId = req.user._id;

    // Get all patients assigned to this practitioner
    const patients = await User.find({
      userType: 'patient',
      assignedPractitioner: practitionerId
    }).select('name email progress currentStage status progressHistory updatedAt').sort({ updatedAt: -1 });

    res.json({
      success: true,
      patients: patients.map(patient => ({
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        progress: patient.progress || 0,
        currentStage: patient.currentStage || 'Initial Assessment',
        status: patient.status || 'pending',
        lastUpdated: patient.updatedAt,
        progressHistory: patient.progressHistory || []
      }))
    });
  } catch (error) {
    console.error('Get patients progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ======================
// Get Patient's Own Progress (for patients)
// ======================
router.get("/my-progress", auth, async (req, res) => {
  try {
    const patientId = req.user._id;

    const patient = await User.findById(patientId).select('-password');

    if (!patient || patient.userType !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Patient access required.'
      });
    }

    // Get practitioner details if assigned
    let practitioner = null;
    if (patient.assignedPractitioner) {
      practitioner = await User.findById(patient.assignedPractitioner)
        .select('name email practiceLocation practiceAreas');
    }

    res.json({
      success: true,
      patient: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        progress: patient.progress || 0,
        currentStage: patient.currentStage || 'Initial Assessment',
        status: patient.status || 'pending',
        wellnessScore: patient.wellnessScore || 0,
        nextSessionDate: patient.nextSessionDate,
        progressHistory: patient.progressHistory || [],
        assignedPractitioner: practitioner,
        lastUpdated: patient.updatedAt
      }
    });
  } catch (error) {
    console.error('Get my progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
