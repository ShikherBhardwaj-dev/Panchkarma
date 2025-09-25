const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// ======================
// Get User Profile
// ======================
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ======================
// Update User Profile
// ======================
router.put("/", auth, async (req, res) => {
  try {
  const {
    name,
    phone,
    address,
    caregiverPhone,
    emergencyContact,
    personalDetails,
    licenseNumber,
    // Practitioner-specific fields
    practiceLocation,
    practiceAreas,
    consultationFee,
    availableForNewPatients,
    bio,
    experience
  } = req.body;

    // Build update object
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (caregiverPhone !== undefined) updateData.caregiverPhone = caregiverPhone;
    if (licenseNumber !== undefined) updateData.licenseNumber = licenseNumber;
    
    // Practitioner-specific fields (only writable by practitioners)
  const currentUser = await User.findById(req.user._id);
    if (currentUser && currentUser.userType === 'practitioner') {
      if (practiceAreas !== undefined) updateData.practiceAreas = practiceAreas;
      if (consultationFee !== undefined) updateData.consultationFee = consultationFee;
      if (availableForNewPatients !== undefined) updateData.availableForNewPatients = availableForNewPatients;
      if (bio !== undefined) updateData.bio = bio;
      if (experience !== undefined) updateData.experience = experience;
    }
    
    // Handle nested objects
    if (address) {
      updateData.address = {
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        country: address.country || 'India'
      };
    }
    
    if (emergencyContact) {
      updateData.emergencyContact = {
        name: emergencyContact.name || '',
        phone: emergencyContact.phone || '',
        relationship: emergencyContact.relationship || ''
      };
    }
    
    if (personalDetails) {
      updateData.personalDetails = {
        dateOfBirth: personalDetails.dateOfBirth || null,
        gender: personalDetails.gender || '',
        bloodGroup: personalDetails.bloodGroup || ''
      };
    }
    
    // Handle practice location for practitioners
    if (practiceLocation) {
      updateData.practiceLocation = {
        address: practiceLocation.address || '',
        city: practiceLocation.city || '',
        state: practiceLocation.state || '',
        pincode: practiceLocation.pincode || '',
        country: practiceLocation.country || 'India',
        coordinates: {
          latitude: practiceLocation.coordinates?.latitude || null,
          longitude: practiceLocation.coordinates?.longitude || null
        }
      };
    }

    console.log('Profile update requested by:', req.user && req.user._id, 'updateData:', JSON.stringify(updateData));
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      success: true,
      msg: "Profile updated successfully",
      user
    });
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ======================
// Get Profile by ID (for practitioners to view patient profiles)
// ======================
router.get("/:userId", auth, async (req, res) => {
  try {
    // Check if user is a practitioner
    const currentUser = await User.findById(req.user._id);
    if (currentUser.userType !== 'practitioner') {
      return res.status(403).json({ msg: "Access denied. Only practitioners can view patient profiles." });
    }

    const user = await User.findById(req.params.userId).select("-password -googleId");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get user profile error:", err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
