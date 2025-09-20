const express = require("express");
const router = express.Router();
const { getAIResponse } = require("../aiChatbot.js");
const twilio = require("twilio");
const { normalizePhone } = require('../utils/phone');

// Twilio setup (WhatsApp/SMS)
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN
);
const severeKeywords = [
  "severe",
  "chest pain",
  "fainting",
  "dizziness",
  "bleeding",
  "emergency",
];

function checkSevere(message) {
  return severeKeywords.some((k) => message.toLowerCase().includes(k));
}

router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || !userId)
      return res.status(400).json({ error: "Message and userId are required" });

    // Get AI reply with context
    const reply = await getAIResponse(userId, message);

    // Severe case alert
    if (checkSevere(message)) {
      try {
        const opts = {
          body: `🚨 Alert: Patient reported severe issue: "${message}".`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: normalizePhone(process.env.PRACTITIONER_PHONE) || process.env.PRACTITIONER_PHONE
        };
        if (process.env.TWILIO_STATUS_CALLBACK_URL) opts.statusCallback = process.env.TWILIO_STATUS_CALLBACK_URL;
        await client.messages.create(opts);
        console.log("✅ WhatsApp/SMS alert sent to practitioner");
      } catch (err) {
        console.error('Failed sending severe alert via Twilio', err && err.message);
      }
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
