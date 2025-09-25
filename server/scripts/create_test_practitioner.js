const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');
require('dotenv').config();

const createTestPractitioner = async () => {
  await connectDB();

  try {
    const practitionerExists = await User.findOne({ email: 'practitioner@ayursutra.com' });
    if (practitionerExists) {
      console.log('Test practitioner already exists.');
      // Optionally update to ensure correct status
      await User.updateOne(
        { email: 'practitioner@ayursutra.com' },
        {
          $set: {
            verificationStatus: 'verified',
            availableForNewPatients: true,
            practiceLocation: {
              address: '123 Wellness Lane',
              city: 'b',
              state: 'c',
              pincode: '411001',
              country: 'India',
            },
            practiceAreas: ['General Consultation', 'Vamana (Therapeutic Vomiting)'],
          },
        }
      );
      console.log('Test practitioner updated to be verified and available.');
      return;
    }

    const practitioner = new User({
      name: 'Dr. Test Practitioner',
      email: 'practitioner@ayursutra.com',
      password: 'password123', // Will be hashed by pre-save hook
      userType: 'practitioner',
      verificationStatus: 'verified',
      availableForNewPatients: true,
      practiceLocation: {
        address: '123 Wellness Lane',
        city: 'b',
        state: 'c',
        pincode: '411001',
        country: 'India',
      },
      practiceAreas: ['General Consultation', 'Vamana (Therapeutic Vomiting)'],
      experience: 10,
      consultationFee: 500,
      bio: 'An experienced Ayurvedic practitioner dedicated to holistic healing.',
    });

    await practitioner.save();
    console.log('Test practitioner created successfully!');
  } catch (error) {
    console.error('Error creating test practitioner:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

createTestPractitioner();
