import React, { useState } from 'react';
import axios from 'axios';

const WhatsAppTester = ({ user }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Test reminder: your session is scheduled');
  const [result, setResult] = useState(null);

  const sendTest = async () => {
    try {
      setResult({ loading: true });
      const res = await axios.post('http://localhost:5000/admin/send-test-whatsapp', { email, message });
      setResult({ success: true, res: res.data });
    } catch (err) {
      setResult({ success: false, error: err.response?.data || err.message });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Admin: WhatsApp Tester</h3>
      <div className="grid grid-cols-1 gap-3">
        <input className="p-2 border rounded" value={email} onChange={e=>setEmail(e.target.value)} placeholder="user email" />
        <textarea className="p-2 border rounded" value={message} onChange={e=>setMessage(e.target.value)} rows={3} />
        <div className="flex gap-2">
          <button onClick={sendTest} className="px-4 py-2 bg-primary-600 text-white rounded">Send Test</button>
        </div>
        <div className="pt-3">
          <pre className="text-xs bg-gray-50 p-2 rounded">{result ? JSON.stringify(result, null, 2) : 'No result yet'}</pre>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppTester;
