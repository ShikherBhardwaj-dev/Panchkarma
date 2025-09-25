const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// ======================
// Submit Verification Request (Practitioner)
// ======================
router.post("/submit", auth, async (req, res) => {
  try {
    const { licenseNumber, additionalDocuments } = req.body;

    // Check if user is a practitioner
    const user = await User.findById(req.user._id);
    if (user.userType !== 'practitioner') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only practitioners can submit verification requests' 
      });
    }

    // Check if already verified
    if (user.verificationStatus === 'verified') {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already verified' 
      });
    }

    // Check if already has pending request
    if (user.verificationRequest && user.verificationRequest.submittedAt) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a pending verification request' 
      });
    }

    // Update user with verification request
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        licenseNumber,
        verificationStatus: 'pending',
        verificationRequest: {
          submittedAt: new Date(),
          licenseNumber,
          additionalDocuments: additionalDocuments || '',
          adminNotes: '',
          reviewedBy: null,
          reviewedAt: null
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Verification request submitted successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error("Submit verification error:", err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ======================
// Get Verification Status (Practitioner)
// ======================
router.get("/status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('verificationStatus verificationRequest licenseNumber');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      verificationStatus: user.verificationStatus,
      licenseNumber: user.licenseNumber,
      verificationRequest: user.verificationRequest
    });
  } catch (err) {
    console.error("Get verification status error:", err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ======================
// Get All Verification Requests (Admin)
// ======================
router.get("/requests", auth, async (req, res) => {
  try {
    // Check if user is admin (you can add admin role check here)
    const currentUser = await User.findById(req.user._id);
    if (currentUser.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin access required.' 
      });
    }

    const verificationRequests = await User.find({
      userType: 'practitioner',
      verificationStatus: 'pending',
      'verificationRequest.submittedAt': { $exists: true }
    }).select('name email licenseNumber verificationRequest createdAt');

    res.json({
      success: true,
      requests: verificationRequests
    });
  } catch (err) {
    console.error("Get verification requests error:", err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ======================
// Review Verification Request (Admin)
// ======================
router.post("/review/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, adminNotes } = req.body; // action: 'approve' or 'reject'

    // Check if user is admin
    const currentUser = await User.findById(req.user._id);
    if (currentUser.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin access required.' 
      });
    }

    const practitioner = await User.findById(userId);
    if (!practitioner || practitioner.userType !== 'practitioner') {
      return res.status(404).json({ 
        success: false, 
        message: 'Practitioner not found' 
      });
    }

    const newStatus = action === 'approve' ? 'verified' : 'rejected';
    
    const updatedPractitioner = await User.findByIdAndUpdate(
      userId,
      {
        verificationStatus: newStatus,
        'verificationRequest.adminNotes': adminNotes || '',
        'verificationRequest.reviewedBy': req.user._id,
        'verificationRequest.reviewedAt': new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `Verification request ${action}d successfully`,
      practitioner: updatedPractitioner
    });
  } catch (err) {
    console.error("Review verification error:", err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ======================
// Get All Practitioners (Admin)
// ======================
router.get("/practitioners", auth, async (req, res) => {
  try {
    // Check if user is admin
    const currentUser = await User.findById(req.user._id);
    if (currentUser.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin access required.' 
      });
    }

    const practitioners = await User.find({ userType: 'practitioner' })
      .select('name email verificationStatus licenseNumber verificationRequest createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      practitioners
    });
  } catch (err) {
    console.error("Get practitioners error:", err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
