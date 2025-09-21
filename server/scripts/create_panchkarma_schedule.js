const mongoose = require('mongoose');
const config = require('../config/default.json');
const User = require('../models/User');
const TherapySession = require('../models/TherapySession');

async function create(practitionerEmail, patientEmail, startDate) {
  await mongoose.connect(config.mongoURI);
  const practitioner = await User.findOne({ email: practitionerEmail });
  const patient = await User.findOne({ email: patientEmail });
  if (!practitioner || !patient) {
    console.error('Practitioner or patient not found');
    process.exit(1);
  }
  const start = startDate ? new Date(startDate) : new Date();
  start.setHours(9,0,0,0);

  const therapyTemplates = [
    { phase: 'Pre', name: 'Pre-Treatment (Snehana/Swedana)', days: 5, durationMins: 60 },
    { phase: 'Main', name: 'Panchakarma Main Procedure', days: 5, durationMins: 180 },
    { phase: 'Post', name: 'Post-Treatment Recovery', days: 5, durationMins: 30 },
  ];

  const sessions = [];
  let current = new Date(start);
  therapyTemplates.forEach(step => {
    for (let i = 0; i < step.days; i++) {
      sessions.push({
        practitioner: practitioner._id,
        patient: patient._id,
        therapyType: 'Panchkarma',
        phase: step.phase,
        sessionName: step.name,
        date: new Date(current),
        startTime: '09:00',
        durationMins: step.durationMins,
        isBooked: true,
      });
      current.setDate(current.getDate() + 1);
    }
  });

  await TherapySession.insertMany(sessions);
  console.log('Created', sessions.length, 'sessions for', patientEmail);
  mongoose.disconnect();
}

if (require.main === module) {
  const [,, practitionerEmail, patientEmail, startDate] = process.argv;
  if (!practitionerEmail || !patientEmail) {
    console.error('Usage: node create_panchkarma_schedule.js <practitionerEmail> <patientEmail> [startDate]');
    process.exit(1);
  }
  create(practitionerEmail, patientEmail, startDate).catch(err => console.error(err));
}
