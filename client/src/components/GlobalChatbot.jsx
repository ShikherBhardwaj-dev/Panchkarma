import React from "react";
import ChatbotWidget from "./Dashboard/ChatbotWidget";

const GlobalChatbot = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ChatbotWidget />
    </div>
  );
};

export default GlobalChatbot;
