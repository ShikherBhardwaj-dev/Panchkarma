// server/aiChatbot.js
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { faqs, precautions } = require("./knowledgeBase.js");

dotenv.config();

// Store conversation history per user
const conversationMemory = {};

/**
 * Get AI response from Gemini API with memory and system prompt
 * @param {string} userId - Unique user identifier
 * @param {string} message - User message
 * @returns {Promise<string>} AI response
 */
async function getAIResponse(userId, message) {
  if (!conversationMemory[userId]) conversationMemory[userId] = [];

  // Push new user message
  conversationMemory[userId].push({ role: "user", content: message });

  // System prompt (prepended every time)
  const systemPrompt = `
You are "Ayursutra", an Ayurvedic Panchkarma wellness assistant.
- Provide authentic, safe, and holistic answers.
- If user asks about precautions, mention: ${precautions.join("; ")}.
- You also have FAQs: ${faqs.map((f) => `${f.question} → ${f.answer}`).join(" | ")}.
- Always reply politely, structured, and educational.
- If the query is outside Ayurveda, politely say you can only help with Ayurvedic wellness.
`;

  // Build context from conversation memory
  const history = conversationMemory[userId]
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  const prompt = `${systemPrompt}\n\nConversation so far:\n${history}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const aiReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I didn’t understand.";

    // Save AI reply in memory
    conversationMemory[userId].push({ role: "assistant", content: aiReply });

    // Keep only last 30 messages to save memory
    if (conversationMemory[userId].length > 30) {
      conversationMemory[userId] = conversationMemory[userId].slice(-30);
    }

    return aiReply;
  } catch (error) {
    console.error("Error in AI response:", error);
    return "Sorry, something went wrong. Please try again.";
  }
}

module.exports = { getAIResponse };