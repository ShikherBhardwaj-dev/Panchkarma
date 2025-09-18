const axios = require('axios');

(async () => {
  try {
    const base = 'http://localhost:5000';
    const userEmail = 'noemail.patient@example.com';
    const scheduledAt = new Date().toISOString();
    const payload = { title: 'Test in-app', body: 'This is a test in-app notification' };

    const res = await axios.post(`${base}/api/notifications`, { userEmail, scheduledAt, channel: 'in-app', payload });
    console.log('Created', res.data);

    const list = await axios.get(`${base}/api/notifications`, { params: { userEmail } });
    console.log('List:', list.data);
  } catch (err) {
    console.error('Error', err.response ? err.response.data : err.message);
  }
})();