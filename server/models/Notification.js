const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'TherapySession' },
  channel: { type: String, enum: ['email', 'sms', 'in-app'], default: 'in-app' },
  payload: { type: Object },
  scheduledAt: { type: Date, required: true },
  sentAt: { type: Date },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  error: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
