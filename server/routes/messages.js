const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
router.post('/', async (req, res) => {
  try {
    const { fromEmail, toEmail, fromId, toId, text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Missing text' });

    let from, to;
    if (fromId) {
      from = await User.findById(fromId);
    } else if (fromEmail) {
      from = await User.findOne({ email: fromEmail });
    }

    if (toId) {
      to = await User.findById(toId);
    } else if (toEmail) {
      to = await User.findOne({ email: toEmail });
    }

    if (!from || !to) return res.status(404).json({ msg: 'User(s) not found' });

    const message = new Message({ from: from._id, to: to._id, text });
    await message.save();
    res.json(message);
  } catch (err) {
    console.error('Error sending message', err);
    res.status(500).json({ msg: err.message });
  }
});

// Get conversation between two users
// Supports query by email (userA, userB) or by id (userAId, userBId)
router.get('/conversation', async (req, res) => {
  try {
    const { userA, userB, userAId, userBId } = req.query;

    let a, b;
    if (userAId && userBId) {
      a = await User.findById(userAId);
      b = await User.findById(userBId);
    } else if (userA && userB) {
      a = await User.findOne({ email: userA });
      b = await User.findOne({ email: userB });
    } else {
      return res.status(400).json({ msg: 'Missing query params (userA/userB or userAId/userBId)' });
    }

    if (!a || !b) return res.status(404).json({ msg: 'User(s) not found' });

    const messages = await Message.find({
      $or: [
        { from: a._id, to: b._id },
        { from: b._id, to: a._id }
      ]
    }).sort({ createdAt: 1 }).populate('from to', 'name email phone');

    res.json(messages);
  } catch (err) {
    console.error('Error fetching conversation', err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
