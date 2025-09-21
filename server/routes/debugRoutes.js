import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

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

export default router;