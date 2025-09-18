// Simple test script to create a test user and generate a schedule
// Usage: node scripts/test_schedule.js
(async () => {
  try {
    const base = 'http://localhost:5000';
    const tomorrow = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];

    // Create test user
    const signupRes = await fetch(`${base}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Auto Test Patient', email: 'autotest.patient@example.com', password: 'Password123!', phone: '+12125551234', userType: 'patient' })
    });
    if (signupRes.ok) console.log('Signup OK'); else console.log('Signup response:', await signupRes.text());

    // Generate schedule
    const scheduleRes = await fetch(`${base}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: 'autotest.patient@example.com', therapyType: 'Virechana', startDate: tomorrow, slotTimes: ['10:00','10:00','10:00','10:00','10:00'] })
    });
    const scheduleBody = await scheduleRes.text();
    console.log('Schedule response status:', scheduleRes.status);
    console.log('Schedule response body:', scheduleBody);

    // List sessions
    const sessionsRes = await fetch(`${base}/sessions?role=practitioner`);
    const sessions = await sessionsRes.json();
    console.log('Sessions (sample):', sessions.slice(0,5));
  } catch (err) {
    console.error('Test script error', err);
  }
})();
