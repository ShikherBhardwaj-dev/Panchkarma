import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const router = express.Router();

// Create a notification (can be used by worker or manually)
router.post('/', async (req, res) => {
  try {
    const { userEmail, sessionId, channel, payload, scheduledAt } = req.body;
    if (!userEmail || !scheduledAt) return res.status(400).json({ msg: 'Missing fields' });

    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const n = new Notification({ user: user._id, session: sessionId, channel, payload, scheduledAt });
    await n.save();
    res.json(n);
  } catch (err) {
    console.error('Error creating notification', err);
    res.status(500).json({ msg: err.message });
  }
});

// List pending notifications for a user
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ msg: 'Missing userEmail' });
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const notes = await Notification.find({ user: user._id }).sort({ scheduledAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Error listing notifications', err);
    res.status(500).json({ msg: err.message });
  }
});

// Mark notification as sent
router.post('/:id/mark-sent', async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ msg: 'Notification not found' });
    n.status = 'sent';
    n.sentAt = new Date();
    await n.save();
    res.json(n);
  } catch (err) {
    console.error('Error marking notification sent', err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;
