const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const User = require('../models/User');

async function main() {
  try {
    await mongoose.connect(config.mongoURI);
    const practitioner = await User.findOne({ userType: 'practitioner' });
    if (!practitioner) {
      console.error('No practitioner found in DB');
      return process.exit(1);
    }

    const payload = { user: { _id: practitioner._id, name: practitioner.name, email: practitioner.email, userType: practitioner.userType } };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration || '24h' });
    console.log('Practitioner token:');
    console.log(token);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
