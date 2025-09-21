import cron from 'node-cron';
import Notification from '../models/Notification.js';
import TherapySession from '../models/TherapySession.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { normalizePhone } from '../utils/phone.js';

const EMAIL_FROM = process.env.EMAIL_FROM;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
// Accept either TWILIO_SID/TWILIO_TOKEN or TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN
const TWILIO_SID = process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN || process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_FROM;
const TWILIO_WHATSAPP_FROM_RAW = process.env.TWILIO_WHATSAPP_FROM;
const TWILIO_STATUS_CALLBACK_URL = process.env.TWILIO_STATUS_CALLBACK_URL;

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
  const normalized = normalizePhone(to) || to;
  const opts = { from: TWILIO_FROM, to: normalized, body };
  if (TWILIO_STATUS_CALLBACK_URL) opts.statusCallback = TWILIO_STATUS_CALLBACK_URL;
  // single retry on transient failure
  try {
    return await twilioClient.messages.create(opts);
  } catch (err) {
    console.warn('sendSms failed, retrying once', err && err.message);
    return twilioClient.messages.create(opts);
  }
}

async function sendWhatsApp(to, body) {
  if (!twilioClient) throw new Error('Twilio not configured');
  if (!TWILIO_WHATSAPP_FROM_RAW) throw new Error('TWILIO_WHATSAPP_FROM not configured');
  // Allow TWILIO_WHATSAPP_FROM to be provided either as "+<number>" or "whatsapp:+<number>"
  const from = TWILIO_WHATSAPP_FROM_RAW.startsWith('whatsapp:') ? TWILIO_WHATSAPP_FROM_RAW : `whatsapp:${TWILIO_WHATSAPP_FROM_RAW}`;
  const normalized = normalizePhone(to) || to;
  const toNumber = String(normalized).startsWith('whatsapp:') ? normalized : `whatsapp:${normalized}`;
  const opts = { from, to: toNumber, body };
  if (TWILIO_STATUS_CALLBACK_URL) opts.statusCallback = TWILIO_STATUS_CALLBACK_URL;
  try {
    return await twilioClient.messages.create(opts);
  } catch (err) {
    console.warn('sendWhatsApp failed, retrying once', err && err.message);
    return twilioClient.messages.create(opts);
  }
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

  // Find sessions scheduled between now and upper (compare full Date stored in `date`)
  // TherapySession.date is a Date field; query using Date objects for accuracy.
  const sessions = await TherapySession.find({
    date: { $gte: now, $lte: upper },
    status: { $ne: 'cancelled' }
  }).populate('patient practitioner');

      for (const s of sessions) {
        try {
          // Build scheduled DateTime: assume s.date is YYYY-MM-DD and s.startTime is HH:MM
          if (!s.startTime || !s.date) {
            console.log('Skipping session without date/startTime', s._id.toString());
            continue;
          }
          const [hh, mm] = s.startTime.split(':').map(Number);
          const scheduledAt = new Date(s.date);
          scheduledAt.setHours(hh, mm, 0, 0);

          // Only notify if scheduledAt is within lookahead window
          if (scheduledAt < now || scheduledAt > upper) {
            console.log('Session outside lookahead window, skipping', { sessionId: s._id.toString(), scheduledAt: scheduledAt.toISOString(), now: now.toISOString(), upper: upper.toISOString() });
            continue;
          }

          // Create in-app notification for patient and practitioner
          const recipients = [s.patient, s.practitioner].filter(Boolean);
          for (const user of recipients) {
            // Skip if user has no contact info
            try {
              const payload = { title: 'Therapy Reminder', body: `Your session ${s.sessionName || ''} is at ${s.startTime} on ${new Date(s.date).toLocaleDateString()}` };
              const existing = await Notification.findOne({ user: user._id, session: s._id, scheduledAt });
              if (existing) { console.log('Notification already exists for user/session', { user: user._id.toString(), session: s._id.toString(), scheduledAt: scheduledAt.toISOString() }); continue; }

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
                  // Prefer WhatsApp if configured, otherwise send SMS
                  try {
                    let result = null;
                    if (TWILIO_WHATSAPP_FROM_RAW) {
                      // set channel before sending so state reflects intent; Note schema updated to allow 'whatsapp'
                      note.channel = 'whatsapp';
                      result = await sendWhatsApp(user.phone, payload.body);
                      console.log('WhatsApp send result', result && result.sid);
                    } else {
                      note.channel = 'sms';
                      result = await sendSms(user.phone, payload.body);
                      console.log('SMS send result', result && result.sid);
                    }
                    note.status = 'sent';
                    note.sentAt = new Date();
                    if (result && result.sid) note.twilioSid = result.sid;
                    note.sendResponse = result || note.sendResponse;
                    try { await note.save(); } catch(saveErr){ console.error('Failed saving notification after send', saveErr); }
                  } catch (err) {
                    console.error('Messaging send error', err);
                    note.status = 'failed';
                    note.error = err.message;
                    try { await note.save(); } catch(saveErr){ console.error('Failed saving failed-notification', saveErr); }
                  }
                } catch (err) {
                  console.error('Messaging send error', err);
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

export default startNotificationWorker;
