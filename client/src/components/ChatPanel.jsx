import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatPanel = ({ currentUserEmail, currentUserId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [contacts, setContacts] = useState([]); // patients or practitioners depending on role
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    // load contacts depending on role: practitioners for patients, patients for practitioners
    async function loadContacts() {
      try {
        const endpoint = userType === 'patient' ? 'practitioners' : 'patients';
        const res = await axios.get(`http://localhost:5000/auth/${endpoint}`);
        setContacts(res.data || []);
        if (res.data && res.data.length) {
          // for patients auto-select the first practitioner; for practitioners select first patient
          setSelectedContactId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Fetch contacts error', err);
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
      const res = await axios.get('http://localhost:5000/api/messages/conversation', {
        params: { userAId: currentUserId, userBId: selectedContactId }
      });
      setMessages(res.data || []);
    } catch (err) {
      console.error('Fetch conversation error', err);
    }
  }

  async function sendMessage() {
    if (!text.trim() || !selectedContactId) return;
    try {
      await axios.post('http://localhost:5000/api/messages', { fromId: currentUserId, toId: selectedContactId, text });
      setText('');
      fetchConversation();
    } catch (err) {
      console.error('Send message error', err);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow border">
      <h4 className="font-semibold mb-2">Chat</h4>
      <div className="mb-2">
        <label className="text-sm">Select contact</label>
        <select className="w-full p-2 border rounded" value={selectedContactId || ''} onChange={e => setSelectedContactId(e.target.value)}>
          {contacts.map(p => <option key={p._id} value={p._id}>{p.name} ({p.email})</option>)}
        </select>
      </div>

      <div className="h-48 overflow-auto border rounded p-2 mb-2">
        {messages.map(m => (
          <div key={m._id} className={`mb-2 ${m.from.email === currentUserEmail ? 'text-right' : 'text-left'}`}>
            <div className="text-xs text-gray-500">{m.from.name}</div>
            <div className="bg-gray-100 inline-block p-2 rounded">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 p-2 border rounded" />
        <button onClick={sendMessage} className="bg-green-500 text-white p-2 rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatPanel;
