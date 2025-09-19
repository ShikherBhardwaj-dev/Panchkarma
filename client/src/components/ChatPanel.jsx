import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPanel = ({ currentUserEmail, currentUserId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [contacts, setContacts] = useState([]); // patients or practitioners depending on role
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    // load contacts depending on role: practitioners for patients, patients for practitioners
    async function loadContacts() {
      try {
        const endpoint = userType === "patient" ? "practitioners" : "patients";
        const res = await axios.get(`http://localhost:5000/auth/${endpoint}`);
        setContacts(res.data || []);
        if (res.data && res.data.length) {
          // for patients auto-select the first practitioner; for practitioners select first patient
          setSelectedContactId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Fetch contacts error", err);
      }
    }
    loadContacts();
  }, [userType]);

  useEffect(() => {
    if (!currentUserId || !selectedContactId) return;
    fetchConversation();
    const iv = setInterval(fetchConversation, 3000);
    return () => clearInterval(iv);
  }, [currentUserId, selectedContactId]);

  async function fetchConversation() {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/messages/conversation",
        {
          params: { userAId: currentUserId, userBId: selectedContactId },
        }
      );
      setMessages(res.data || []);
    } catch (err) {
      console.error("Fetch conversation error", err);
    }
  }

  async function sendMessage() {
    if (!text.trim() || !selectedContactId) return;
    try {
      await axios.post("http://localhost:5000/api/messages", {
        fromId: currentUserId,
        toId: selectedContactId,
        text,
      });
      setText("");
      fetchConversation();
    } catch (err) {
      console.error("Send message error", err);
    }
  }

  return (
    <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-6 rounded-lg shadow-sm border border-amber-100">
      <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
        <div className="mr-2 w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
        Chat
      </h3>
      <div className="mb-4">
        <label className="text-sm font-medium text-amber-800 block mb-2">
          Select contact
        </label>
        <select
          className="w-full p-2.5 bg-white/80 border border-amber-200 text-amber-900 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          value={selectedContactId || ""}
          onChange={(e) => setSelectedContactId(e.target.value)}
        >
          {contacts.map((p) => (
            <option key={p._id} value={p._id} className="text-amber-900">
              {p.name} ({p.email})
            </option>
          ))}
        </select>
      </div>

      <div className="h-64 overflow-auto border border-amber-200 rounded-lg p-4 mb-4 bg-white/80">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`mb-3 ${
              m.from.email === currentUserEmail ? "text-right" : "text-left"
            }`}
          >
            <div className="text-xs text-amber-600 mb-1">{m.from.name}</div>
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                m.from.email === currentUserEmail
                  ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm"
                  : "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900 border border-amber-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-3 bg-white/80 border border-amber-200 rounded-lg text-amber-900 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg shadow-md hover:from-amber-500 hover:to-orange-500 transition-all hover:shadow-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
