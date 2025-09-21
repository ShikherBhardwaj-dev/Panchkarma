import mongoose from 'mongoose';
import User from '../models/User.js';
import TherapySession from '../models/TherapySession.js';
import connectDB from '../config/db.js';
import bcrypt from 'bcryptjs';

const createTestData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await TherapySession.deleteMany({});

    const salt = await bcrypt.genSalt(10);

    const practitionerPassword = await bcrypt.hash('test1234', salt);
    const practitioner = new User({
      name: 'Dr. Test Practitioner',
      email: 'practitioner@test.com',
      password: practitionerPassword,
      userType: 'practitioner',
    });
    await practitioner.save();

    const patientPassword = await bcrypt.hash('test1234', salt);
    const patient = new User({
      name: 'Test Patient',
      email: 'patient@test.com',
      password: patientPassword,
      userType: 'patient',
      assignedPractitioner: practitioner._id,
      progress: 20,
      practitionerNotes: 'Initial notes',
      recommendations: 'Initial recommendations',
      currentStage: 'Initial Assessment',
      treatmentStartDate: new Date(),
    });
    await patient.save();

    const session = new TherapySession({
      patient: patient._id,
      practitioner: practitioner._id,
      date: new Date(),
      time: '10:00',
      isBooked: true,
      sessionName: 'Initial Therapy Session',
      phase: 'Phase 1',
      therapyType: 'Panchakarma',
      practitionerNotes: {
        sessionNotes: 'Session initial notes',
      },
      recommendations: 'Session recommendations',
    });
    await session.save();

    console.log('Test data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
};

createTestData();
