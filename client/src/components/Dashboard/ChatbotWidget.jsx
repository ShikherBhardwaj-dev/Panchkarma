import React, { useState } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react"; // nice icons

const ChatbotWidget = ({ user: userProp }) => {
  // Prefer user from prop, fallback to localStorage
  const user = userProp || JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I’m your wellness assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {

      const res = await axios.post("http://localhost:5000/api/chat", {
        // Use _id if available, else email, else fallback to 'guest'
        userId: user?._id || user?.email || "guest",
        message: input,
      });

      const botReply =
        res.data.reply || "Sorry, I couldn’t understand. Please try again.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("❌ Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ Server error. Please try later." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl border flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold">Wellness Assistant</span>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 max-h-80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm max-w-[75%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-green-100 text-gray-800"
                    : "mr-auto bg-gray-100 text-gray-700"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-green-300"
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-3 rounded-lg hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;