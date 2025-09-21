import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

// Simple markdown renderer
const MarkdownRenderer = ({ children }) => {
  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-green-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/### (.*)/g, '<h3 class="font-bold text-base mb-1">$1</h3>')
      .replace(/## (.*)/g, '<h2 class="font-bold text-lg mb-2">$1</h2>')
      .replace(/# (.*)/g, '<h1 class="font-bold text-xl mb-2">$1</h1>')
      .replace(/^\- (.*)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*)/gm, '<li class="ml-4">$1</li>');
  };

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: formatText(children) }}
    />
  );
};

const ChatbotWidget = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm your wellness assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    const messageText = input;
    setInput("");
    setIsTyping(true);
    
    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        userId: user?._id,
        message: messageText
      });
      const botReply =
        res.data.reply || "Sorry, I couldn't understand. Please try again.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("❌ Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Please try later." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button - Pure Perfection */}
      {!isOpen && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative w-16 h-16 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-emerald-500/40 transition-all duration-500 hover:scale-110 animate-pulse hover:animate-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 blur-sm"></div>
            <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <MessageCircle size={28} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" />
            
            {/* Notification dot */}
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce shadow-lg">
              1
            </div>
            
            {/* Ambient glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-30 blur-2xl scale-150 group-hover:scale-[2] transition-all duration-1000"></div>
          </button>
        </div>
      )}

      {/* Chat Window - Ultimate Premium */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-[500px] h-[650px] z-50 animate-in slide-in-from-bottom-8 fade-in duration-500 ease-out">
          <div className="w-full h-full bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden relative">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-3xl"></div>
            
            {/* Header - Absolute Perfection */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6 flex justify-between items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-300 rounded-full animate-pulse shadow-lg"></div>
                <div>
                  <h3 className="font-bold text-lg text-white">Wellness Assistant</h3>
                  <p className="text-emerald-100 text-sm opacity-90">Always here to help</p>
                </div>
                <Sparkles size={20} className="text-emerald-200 animate-pulse ml-2" />
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="relative bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 hover:scale-110"
              >
                <X size={24} className="text-white" />
              </button>
              
              {/* Header wave effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1">
                <div className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
              </div>
            </div>

            {/* Messages - Ultra Premium */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-white/50 to-white/80 backdrop-blur-sm custom-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-4 duration-300`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`group relative max-w-[85%] px-5 py-4 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-emerald-500/20"
                      : "bg-white/90 text-gray-800 border border-emerald-100 shadow-emerald-500/10"
                  }`}>
                    
                    {/* Message bubble arrows */}
                    {msg.sender === "bot" && (
                      <div className="absolute -left-3 top-4 w-0 h-0 border-r-12 border-r-white/90 border-t-6 border-t-transparent border-b-6 border-b-transparent filter drop-shadow-lg"></div>
                    )}
                    {msg.sender === "user" && (
                      <div className="absolute -right-3 top-4 w-0 h-0 border-l-12 border-l-emerald-600 border-t-6 border-t-transparent border-b-6 border-b-transparent filter drop-shadow-lg"></div>
                    )}
                    
                    {/* Message content with markdown */}
                    <div className="leading-relaxed">
                      {msg.sender === "bot" ? (
                        <MarkdownRenderer>{msg.text}</MarkdownRenderer>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>
                    
                    {/* Hover glow effect */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-300 ${
                      msg.sender === "user" 
                        ? "bg-white" 
                        : "bg-gradient-to-r from-emerald-400 to-teal-400"
                    }`}></div>
                  </div>
                </div>
              ))}

              {/* Typing indicator - Premium */}
              {isTyping && (
                <div className="flex justify-start animate-in slide-in-from-bottom-4 fade-in duration-300">
                  <div className="bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl border border-emerald-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">AI is crafting your response...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Absolute Premium */}
            <div className="p-6 bg-gradient-to-r from-white/80 via-white/90 to-white/80 backdrop-blur-xl border-t border-emerald-100/50">
              <div className="flex gap-4 items-end">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Share your wellness concerns..."
                    disabled={isTyping}
                    className="w-full bg-white/90 backdrop-blur-sm border-2 border-emerald-200 rounded-2xl px-6 py-4 text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 font-medium"
                  />
                  
                  {/* Input glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl opacity-0 focus-within:opacity-100 transition-all duration-500 -z-10 blur-xl"></div>
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="group relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed"
                >
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </button>
              </div>
              
              {/* Quick suggestions */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {["Meditation tips", "Stress relief", "Sleep better", "Healthy habits"].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="flex-shrink-0 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm rounded-full border border-emerald-200 hover:border-emerald-300 transition-all duration-200 hover:scale-105"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mega premium shadow */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-teal-500/20 blur-3xl rounded-3xl scale-110 opacity-60"></div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }
        
        .border-l-12 {
          border-left-width: 12px;
        }
        .border-r-12 {
          border-right-width: 12px;
        }
        .border-t-6 {
          border-top-width: 6px;
        }
        .border-b-6 {
          border-bottom-width: 6px;
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;