// server/aiChatbot.js
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Store conversation history per user
const conversationMemory = {};

// Send message to Gemini with memory
export async function getAIResponse(userId, message) {
  if (!conversationMemory[userId]) conversationMemory[userId] = [];

  // Push new user message
  conversationMemory[userId].push({ role: "user", content: message });

  // Prepare context to send to Gemini
  const prompt = conversationMemory[userId]
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  const aiReply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I didn’t understand.";

  // Push AI reply to memory
  conversationMemory[userId].push({ role: "assistant", content: aiReply });

  // Optional: Keep only last 10 messages to save memory
  if (conversationMemory[userId].length > 20) {
    conversationMemory[userId] = conversationMemory[userId].slice(-20);
  }

  return aiReply;
}
