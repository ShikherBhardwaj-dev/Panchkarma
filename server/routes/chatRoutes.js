// server/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { getAIResponse } = require("../aiChatbot.js");
const twilio = require("twilio");
const { normalizePhone } = require("../utils/phone");
const User = require("../models/User");

// Twilio setup (WhatsApp/SMS)
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN
);

// Keywords for severe alerts
const severeKeywords = [
  "severe",
  "chest pain",
  "fainting",
  "dizziness",
  "bleeding",
  "emergency",
];

// Check if message contains severe keywords
function checkSevere(message) {
  return severeKeywords.some((k) => message.toLowerCase().includes(k));
}

router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || !userId)
      return res.status(400).json({ error: "Message and userId are required" });

    // Get AI response from chatbot
    const reply = await getAIResponse(userId, message);

    // Send alert to practitioner if severe keywords detected
    if (checkSevere(message)) {
      try {
        // Get user information
        const user = await User.findById(userId);
        if (!user) {
          console.error('User not found:', userId);
          return;
        }

        // Format numbers specifically for WhatsApp
        const fromNumber = `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;
        const toNumber = `whatsapp:${normalizePhone(process.env.PRACTITIONER_PHONE) || process.env.PRACTITIONER_PHONE}`;
        
        const opts = {
          body: `🚨 Alert: Patient ${user.name} (${user.email}) reported severe issue: "${message}".`,
          from: fromNumber,
          to: toNumber,
        };

        // Debug logging
        console.log('Attempting to send WhatsApp alert:', {
          from: fromNumber,
          to: toNumber,
          body: opts.body
        });

        if (process.env.TWILIO_STATUS_CALLBACK_URL) {
          opts.statusCallback = process.env.TWILIO_STATUS_CALLBACK_URL;
        }

        const messageResponse = await client.messages.create(opts);
        console.log("✅ WhatsApp alert sent to practitioner", {
          messageSid: messageResponse.sid,
          status: messageResponse.status
        });
      } catch (err) {
        console.error("Failed sending severe alert via Twilio", err?.message);
      }
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err?.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
