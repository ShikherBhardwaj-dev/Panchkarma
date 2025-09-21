// GlobalChatbot component
const GlobalChatbot = ({ user }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ChatbotWidget user={user} />
    </div>
  );
};

export default GlobalChatbot;