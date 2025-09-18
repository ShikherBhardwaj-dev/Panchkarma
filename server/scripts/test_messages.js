// Test messaging flow: ensure practitioner->patient messages persist and are retrievable by IDs
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/User');
const cfg = require('../config/default.json');

(async () => {
  // connect directly to DB for fallback lookups
  try {
    await mongoose.connect(cfg.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    console.error('Direct mongoose connect failed (fallback lookups may not work):', err.message);
  }
  const base = 'http://localhost:5000';
  try {
    // Ensure practitioner exists
    const pracEmail = 'dr.test@example.com';
    const patEmail = 'noemail.patient@example.com';

    async function signupIfNeeded(email, name, userType) {
      try {
        const res = await axios.post(`${base}/auth/signup`, { name, email, password: 'Password123!', phone: '+12125550001', userType }, { headers: { 'Content-Type': 'application/json' } });
        console.log('Signup response for', email, 'status', res.status, 'data', res.data);
        if (res && (res.status === 200 || res.status === 201)) {
          console.log('Signed up', email);
          return res.data;
        }
      } catch (err) {
        console.error('Signup attempt failed for', email, err.response ? err.response.data : err.message);
        // ignore signup errors (user may already exist)
      }
      // Try to fetch via lookup endpoint
      // Fallback: try server endpoint for patients (works for patient type)
      try {
        const userRes = await axios.get(`${base}/auth/patients`);
        const list = userRes.data || [];
        const found = list.find(u => u.email === email);
        if (found) return found;
      } catch (err) {
        // ignore
      }

      // Final fallback: query DB directly (requires mongo connection)
      try {
        const u = await User.findOne({ email }).select('_id name email');
        if (u) return u;
      } catch (err) {
        // ignore
      }
      return null;
    }

    const prac = await signupIfNeeded(pracEmail, 'Dr Test', 'practitioner');
    const pat = await signupIfNeeded(patEmail, 'No Email Patient', 'patient');

    if (!prac || !pat) {
      console.error('Could not ensure test users exist', prac, pat);
      return;
    }

    const fromId = prac._id || prac.id;
    const toId = pat._id || pat.id;

    // Send message
    try {
      const sendRes = await axios.post(`${base}/api/messages`, { fromId, toId, text: 'Test message from practitioner (automated)' }, { headers: { 'Content-Type': 'application/json' } });
      console.log('Send status', sendRes.status);
      console.log('Send body', sendRes.data);
    } catch (err) {
      console.error('Send message failed', err.response ? err.response.data : err.message);
    }

    // Fetch conversation
    try {
      const convRes = await axios.get(`${base}/api/messages/conversation`, { params: { userAId: fromId, userBId: toId } });
      const conv = convRes.data || [];
      console.log('Conversation length', conv.length);
      console.log(conv.slice(-5));
    } catch (err) {
      console.error('Fetch conversation failed', err.response ? err.response.data : err.message);
    }
  } catch (err) {
    console.error('Test messages error', err);
  }
})();
