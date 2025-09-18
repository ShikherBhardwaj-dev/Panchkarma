const express = require("express");
const router = express.Router();
const { getAIResponse } = require("../aiChatbot.js");
const twilio = require("twilio");

// Twilio setup (WhatsApp/SMS)
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
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
      await client.messages.create({
        body: `🚨 Alert: Patient reported severe issue: "${message}".`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.PRACTITIONER_PHONE,
      });
      console.log("✅ WhatsApp/SMS alert sent to practitioner");
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
