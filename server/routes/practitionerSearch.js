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

    // Allow both patients and practitioners (and admins if present) to search for practitioners.
    // Keep the restriction that only verified practitioners are returned and must be available for new patients.
    if (!user || !['patient', 'practitioner', 'admin'].includes(user.userType)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only registered patients or practitioners can search for practitioners.' 
      });
    }

    // Build search query
    let query = { userType: 'practitioner' };

    // By default, only show verified practitioners available for new patients.
    let requireVerified = true;
    let requireAvailable = true;

    // Allow practitioners or admins to request unverified results by passing includeUnverified=true
    // (useful for finding recently-updated profiles during testing). This is restricted to
    // requester roles 'practitioner' and 'admin' only.
    const includeUnverified = req.query.includeUnverified === 'true';
    if (includeUnverified && ['practitioner', 'admin'].includes(user.userType)) {
      requireVerified = false;
      // When includeUnverified is requested we still respect availableForNewPatients unless explicitly overridden
      if (req.query.includeUnavailable === 'true' && user.userType === 'admin') {
        requireAvailable = false;
      }
    }

    if (requireVerified) query.verificationStatus = 'verified';
    if (requireAvailable) query.availableForNewPatients = true;

    // Add location filters. Match both practiceLocation.* and the user's address.* fields
    // to handle cases where practitioners filled address.city instead of practiceLocation.city
    if (city) {
      query['$or'] = query['$or'] || [];
      query['$or'].push({ 'practiceLocation.city': new RegExp(city, 'i') });
      query['$or'].push({ 'address.city': new RegExp(city, 'i') });
    }
    if (state) {
      query['$or'] = query['$or'] || [];
      query['$or'].push({ 'practiceLocation.state': new RegExp(state, 'i') });
      query['$or'].push({ 'address.state': new RegExp(state, 'i') });
    }
    if (pincode) {
      query['$or'] = query['$or'] || [];
      query['$or'].push({ 'practiceLocation.pincode': pincode });
      query['$or'].push({ 'address.pincode': pincode });
    }
    if (practiceArea) {
      query['practiceAreas'] = { $in: [new RegExp(practiceArea, 'i')] };
    }

    // Find practitioners
    const practitioners = await User.find(query)
      .select('name email practiceLocation practiceAreas consultationFee bio experience verificationStatus')
      .sort({ experience: -1, name: 1 });

    // Debugging: include debugMatches array when requested by practitioners/admins, and always log constructed query
    let debugMatches = undefined;
    console.log('Practitioner search - requester:', user.email || user._id, 'queryParams:', req.query, 'constructedQuery:', JSON.stringify(query));
    if (includeUnverified && ['practitioner', 'admin'].includes(user.userType)) {
      try {
        debugMatches = practitioners.map(p => ({ _id: p._id, name: p.name, city: p.practiceLocation?.city, state: p.practiceLocation?.state, verified: p.verificationStatus }));
        console.log('Practitioner search debug - matches:', debugMatches);
      } catch (e) {
        console.error('Error building debugMatches:', e);
      }
    } else {
      console.log('Practitioner search - count:', practitioners.length);
    }

    const resp = {
      success: true,
      practitioners: practitioners,
      count: practitioners.length
    };
    if (debugMatches) resp.debugMatches = debugMatches;

    res.json(resp);

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

    // Allow authenticated patients and practitioners to view practitioner details
    if (!user || !['patient', 'practitioner', 'admin'].includes(user.userType)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Only registered patients or practitioners can view practitioner details.' 
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
