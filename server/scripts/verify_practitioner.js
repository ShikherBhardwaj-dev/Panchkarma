const mongoose = require('mongoose');
const config = require('../config/default.json');
const User = require('../models/User');

async function main() {
  try {
    const rawArgs = process.argv.slice(2);
    let email = null;
    let id = null;
    rawArgs.forEach(arg => {
      if (arg.startsWith('--email=')) email = arg.split('=')[1];
      if (arg.startsWith('--id=')) id = arg.split('=')[1];
    });

    if (!email && !id) {
      console.error('Usage: node verify_practitioner.js --email=someone@example.com   OR   --id=<mongodb-id>');
      process.exit(1);
    }

    await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    let practitioner = null;
    if (email) practitioner = await User.findOne({ email: String(email).toLowerCase() });
    if (!practitioner && id) practitioner = await User.findById(id);

    if (!practitioner) {
      console.error('Practitioner not found');
      process.exit(1);
    }

    if (practitioner.userType !== 'practitioner') {
      console.error('User is not a practitioner:', practitioner.email);
      process.exit(1);
    }

    practitioner.verificationStatus = 'verified';
    practitioner.availableForNewPatients = true;
    // mark verificationRequest reviewed for traceability in dev
    practitioner.verificationRequest = practitioner.verificationRequest || {};
    practitioner.verificationRequest.adminNotes = (practitioner.verificationRequest.adminNotes || '') + ' Verified via script.';
    practitioner.verificationRequest.reviewedAt = new Date();

    await practitioner.save();

    console.log(`Practitioner verified: ${practitioner.email} (id: ${practitioner._id})`);
    process.exit(0);
  } catch (err) {
    console.error('Error verifying practitioner:', err);
    process.exit(1);
  }
}

main();
