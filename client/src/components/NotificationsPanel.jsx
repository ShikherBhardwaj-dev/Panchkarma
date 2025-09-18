import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationsPanel = ({ userEmail, currentUserId, userType }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!userEmail) return;
    fetchNotes();
    const iv = setInterval(fetchNotes, 10000);
    return () => clearInterval(iv);
  }, [userEmail]);

  async function fetchNotes() {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications', { params: { userEmail } });
      setNotes(res.data || []);
    } catch (err) {
      console.error('Fetch notifications error', err);
    }
  }

  async function markSent(id) {
    try {
      await axios.post(`http://localhost:5000/api/notifications/${id}/mark-sent`);
      fetchNotes();
    } catch (err) {
      console.error('Mark sent error', err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow border">
        <h4 className="font-semibold mb-2">Notifications</h4>
        <ul className="space-y-2">
          {notes.map(n => (
            <li key={n._id} className="p-2 border rounded">
              <div className="text-sm font-medium">{n.payload?.title}</div>
              <div className="text-xs text-gray-600">{n.payload?.body}</div>
              <div className="text-xs text-gray-400">Channel: {n.channel} | Status: {n.status}</div>
              {n.status !== 'sent' && (
                <button onClick={() => markSent(n._id)} className="mt-2 bg-blue-500 text-white p-1 rounded">Mark sent</button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat has been moved to the full Notifications & Care page */}
    </div>
  );
};

export default NotificationsPanel;
