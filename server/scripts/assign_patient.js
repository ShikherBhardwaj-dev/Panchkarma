import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const assignPatientToPractitioner = async () => {
  try {
    await connectDB();

    const patientEmail = 'patient@test.com';
    const practitionerEmail = 'practitioner@test.com';

    const patient = await User.findOne({ email: patientEmail });
    const practitioner = await User.findOne({ email: practitionerEmail });

    if (!patient || !practitioner) {
      console.error('Patient or practitioner not found');
      process.exit(1);
    }

    patient.assignedPractitioner = practitioner._id;
    await patient.save();

    console.log('Patient assigned to practitioner successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error assigning patient:', error);
    process.exit(1);
  }
};

assignPatientToPractitioner();
