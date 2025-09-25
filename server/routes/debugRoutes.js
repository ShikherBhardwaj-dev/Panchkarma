const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Debug route to check JWT and user info
router.get('/check-auth', auth, async (req, res) => {
    try {
        const fullUser = await User.findById(req.user._id).select('-password');
        res.json({
            message: 'Debug info',
            authHeader: req.header('x-auth-token') ? 'Present' : 'Missing',
            decodedToken: req.user,
            userFromDb: fullUser,
            allHeaders: req.headers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Debug route to list all users (patients and practitioners)
router.get('/list-users', auth, async (req, res) => {
    try {
        const practitioners = await User.find({ userType: 'practitioner' })
            .select('name email userType _id');
        const patients = await User.find({ userType: 'patient' })
            .select('name email userType assignedPractitioner _id');
        
        res.json({
            practitioners,
            patients,
            currentUser: {
                id: req.user._id,
                userType: req.user.userType
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Debug route: Get practitioner location & status (restricted to practitioner themselves or admin)
router.get('/practitioner/:id/location', auth, async (req, res) => {
    try {
        const targetId = req.params.id;
        const requester = await User.findById(req.user._id);
        // Only allow practitioners to see their own record or admins
        if (!requester) return res.status(403).json({ message: 'Access denied' });
        // Allow admin, or the practitioner themselves. Practitioners can view their own record.
        if (requester.userType !== 'admin' && requester._id.toString() !== targetId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const practitioner = await User.findById(targetId).select('name practiceLocation verificationStatus availableForNewPatients');
        if (!practitioner) return res.status(404).json({ message: 'Practitioner not found' });

        res.json({
            _id: practitioner._id,
            name: practitioner.name,
            practiceLocation: practitioner.practiceLocation,
            verificationStatus: practitioner.verificationStatus,
            availableForNewPatients: practitioner.availableForNewPatients
        });
    } catch (err) {
        console.error('Debug practitioner location error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Debug route: List patients assigned to current practitioner (for debugging)
router.get('/my-assigned-patients', auth, async (req, res) => {
    try {
        const requester = await User.findById(req.user._id);
        if (!requester || requester.userType !== 'practitioner') {
            return res.status(403).json({ message: 'Access denied. Practitioner only.' });
        }

        const patients = await User.find({ userType: 'patient', assignedPractitioner: requester._id })
            .select('name email progress currentStage status assignedPractitioner');

        res.json({ success: true, patients });
    } catch (err) {
        console.error('Debug my assigned patients error:', err);
        res.status(500).json({ message: err.message });
    }
});

// TEMP DEBUG: Search practitioners ignoring verification/availability (practitioner/admin only)
router.get('/practitioner-search', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !['practitioner', 'admin'].includes(user.userType)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { city, state, pincode } = req.query;
        let query = { userType: 'practitioner' };
        const orClauses = [];
        if (city) {
            orClauses.push({ 'practiceLocation.city': new RegExp(city, 'i') });
            orClauses.push({ 'address.city': new RegExp(city, 'i') });
        }
        if (state) {
            orClauses.push({ 'practiceLocation.state': new RegExp(state, 'i') });
            orClauses.push({ 'address.state': new RegExp(state, 'i') });
        }
        if (pincode) {
            orClauses.push({ 'practiceLocation.pincode': pincode });
            orClauses.push({ 'address.pincode': pincode });
        }
        if (orClauses.length) query['$or'] = orClauses;

        const practitioners = await User.find(query).select('name email userType practiceLocation address verificationStatus availableForNewPatients');
        res.json({ success: true, count: practitioners.length, practitioners });
    } catch (err) {
        console.error('Debug practitioner-search error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Export router
module.exports = router;
