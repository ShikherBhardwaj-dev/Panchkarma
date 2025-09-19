import React, { useState } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react"; // nice icons

const ChatbotWidget = () => {
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
        message: input,
      });

      const botReply =
        res.data.reply || "Sorry, I couldn’t understand. Please try again.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("❌ Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Please try later." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 rounded-full shadow-lg hover:from-amber-500 hover:to-orange-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-sm rounded-lg shadow-xl border border-amber-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 flex justify-between items-center rounded-t-lg">
            <div className="flex items-center">
              <div className="mr-2 w-1 h-6 bg-white/30 rounded-full"></div>
              <span className="font-semibold">Wellness Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-96">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg text-sm max-w-[80%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-gradient-to-br from-amber-500 to-orange-500 text-white p-3 shadow-sm"
                    : "mr-auto bg-white/80 border border-amber-200 text-amber-900 p-3"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-amber-200 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-white/80 border border-amber-200 rounded-lg px-4 py-2.5 text-amber-900 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all shadow-md hover:shadow-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
