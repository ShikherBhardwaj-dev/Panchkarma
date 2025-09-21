const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// ======================
// Search Practitioners
// ======================
router.get("/search", auth, async (req, res) => {
  try {
    const { city, state, pincode, practiceArea, maxDistance } = req.query;
    const user = await User.findById(req.user._id);

    if (user.userType !== 'patient') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only patients can search for practitioners' 
      });
    }

    // Build search query
    let query = {
      userType: 'practitioner',
      verificationStatus: 'verified', // Only show verified practitioners
      availableForNewPatients: true
    };

    // Add location filters
    if (city) {
      query['practiceLocation.city'] = new RegExp(city, 'i');
    }
    if (state) {
      query['practiceLocation.state'] = new RegExp(state, 'i');
    }
    if (pincode) {
      query['practiceLocation.pincode'] = pincode;
    }
    if (practiceArea) {
      query['practiceAreas'] = { $in: [new RegExp(practiceArea, 'i')] };
    }

    // Find practitioners
    const practitioners = await User.find(query)
      .select('name email practiceLocation practiceAreas consultationFee bio experience verificationStatus')
      .sort({ experience: -1, name: 1 });

    res.json({
      success: true,
      practitioners: practitioners,
      count: practitioners.length
    });

  } catch (err) {
    console.error("Search practitioners error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ======================
// Get Practitioner Details
// ======================
router.get("/:practitionerId", auth, async (req, res) => {
  try {
    const { practitionerId } = req.params;
    const user = await User.findById(req.user._id);

    if (user.userType !== 'patient') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only patients can view practitioner details' 
      });
    }

    const practitioner = await User.findOne({
      _id: practitionerId,
      userType: 'practitioner',
      verificationStatus: 'verified'
    }).select('name email practiceLocation practiceAreas consultationFee bio experience verificationStatus');

    if (!practitioner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Practitioner not found' 
      });
    }

    res.json({
      success: true,
      practitioner: practitioner
    });

  } catch (err) {
    console.error("Get practitioner details error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ======================
// Assign Patient to Practitioner
// ======================
router.post("/assign", auth, async (req, res) => {
  try {
    const { practitionerId } = req.body;
    const user = await User.findById(req.user._id);

    if (user.userType !== 'patient') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only patients can assign themselves to practitioners' 
      });
    }

    // Check if practitioner exists and is verified
    const practitioner = await User.findOne({
      _id: practitionerId,
      userType: 'practitioner',
      verificationStatus: 'verified',
      availableForNewPatients: true
    });

    if (!practitioner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Practitioner not found or not available for new patients' 
      });
    }

    // Check if patient is already assigned
    if (user.assignedPractitioner) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already assigned to a practitioner. Please contact support to change your assignment.' 
      });
    }

    // Assign patient to practitioner
    user.assignedPractitioner = practitionerId;
    await user.save();

    res.json({
      success: true,
      message: 'Successfully assigned to practitioner',
      practitioner: {
        _id: practitioner._id,
        name: practitioner.name,
        email: practitioner.email
      }
    });

  } catch (err) {
    console.error("Assign practitioner error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ======================
// Get Patient's Assigned Practitioner
// ======================
router.get("/assigned/current", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.userType !== 'patient') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only patients can view their assigned practitioner' 
      });
    }

    if (!user.assignedPractitioner) {
      return res.json({
        success: true,
        assigned: false,
        message: 'No practitioner assigned'
      });
    }

    const practitioner = await User.findById(user.assignedPractitioner)
      .select('name email practiceLocation practiceAreas consultationFee bio experience');

    if (!practitioner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Assigned practitioner not found' 
      });
    }

    res.json({
      success: true,
      assigned: true,
      practitioner: practitioner
    });

  } catch (err) {
    console.error("Get assigned practitioner error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// ======================
// Remove Patient Assignment
// ======================
router.delete("/assigned", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.userType !== 'patient') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only patients can remove their practitioner assignment' 
      });
    }

    if (!user.assignedPractitioner) {
      return res.status(400).json({ 
        success: false, 
        message: 'No practitioner assigned' 
      });
    }

    user.assignedPractitioner = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Successfully removed practitioner assignment'
    });

  } catch (err) {
    console.error("Remove assignment error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
