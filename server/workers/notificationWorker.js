const cron = require('node-cron');
const Notification = require('../models/Notification');
const TherapySession = require('../models/TherapySession');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const EMAIL_FROM = process.env.EMAIL_FROM;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const TWILIO_FROM = process.env.TWILIO_FROM;

let transporter = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({ host: SMTP_HOST, auth: { user: SMTP_USER, pass: SMTP_PASS } });
}

let twilioClient = null;
if (TWILIO_SID && TWILIO_TOKEN) {
  twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);
}

async function sendEmail(to, subject, text) {
  if (!transporter) throw new Error('SMTP not configured');
  return transporter.sendMail({ from: EMAIL_FROM || SMTP_USER, to, subject, text });
}

async function sendSms(to, body) {
  if (!twilioClient) throw new Error('Twilio not configured');
  return twilioClient.messages.create({ from: TWILIO_FROM, to, body });
}

// This job runs every 5 minutes and schedules notifications for sessions
// starting within the next X minutes (e.g., 60 minutes). It creates Notification docs
// and attempts to send email/SMS if provider credentials are present.
function startNotificationWorker() {
  // run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const lookaheadMinutes = parseInt(process.env.NOTIFY_LOOKAHEAD_MINUTES || '60', 10);
      const now = new Date();
      const upper = new Date(now.getTime() + lookaheadMinutes * 60000);

      // Find sessions scheduled between now and upper that are not cancelled
      const sessions = await TherapySession.find({
        date: { $gte: now.toISOString().split('T')[0], $lte: upper.toISOString().split('T')[0] },
        status: { $ne: 'cancelled' }
      }).populate('patient practitioner');

      for (const s of sessions) {
        try {
          // Build scheduled DateTime: assume s.date is YYYY-MM-DD and s.startTime is HH:MM
          if (!s.startTime || !s.date) continue;
          const [hh, mm] = s.startTime.split(':').map(Number);
          const scheduledAt = new Date(s.date);
          scheduledAt.setHours(hh, mm, 0, 0);

          // Only notify if scheduledAt is within lookahead window
          if (scheduledAt < now || scheduledAt > upper) continue;

          // Create in-app notification for patient and practitioner
          const recipients = [s.patient, s.practitioner].filter(Boolean);
          for (const user of recipients) {
            // Skip if user has no contact info
            try {
              const payload = { title: 'Therapy Reminder', body: `Your session ${s.sessionName || ''} is at ${s.startTime} on ${s.date}` };
              const existing = await Notification.findOne({ user: user._id, session: s._id, scheduledAt });
              if (existing) continue;

              const note = new Notification({ user: user._id, session: s._id, channel: 'in-app', payload, scheduledAt });
              await note.save();

              // Attempt to send email or SMS immediately if configured
              if (user.email && transporter) {
                try {
                  await sendEmail(user.email, payload.title, payload.body);
                  note.status = 'sent';
                  note.sentAt = new Date();
                  await note.save();
                } catch (err) {
                  console.error('Email send error', err);
                  note.status = 'failed';
                  note.error = err.message;
                  await note.save();
                }
              } else if (user.phone && twilioClient) {
                try {
                  await sendSms(user.phone, payload.body);
                  note.status = 'sent';
                  note.sentAt = new Date();
                  await note.save();
                } catch (err) {
                  console.error('SMS send error', err);
                  note.status = 'failed';
                  note.error = err.message;
                  await note.save();
                }
              } else {
                // no delivery channel configured, leave as in-app pending
              }
            } catch (innerErr) {
              console.error('Error creating notification for session', s._id, innerErr);
            }
          }
        } catch (err) {
          console.error('Error processing session for notifications', s._id, err);
        }
      }
    } catch (err) {
      console.error('Notification worker error', err);
    }
  });
}

module.exports = { startNotificationWorker };
