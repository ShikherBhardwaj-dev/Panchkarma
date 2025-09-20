const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/default.json');
const User = require('../models/User');

async function main() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongoURI);
        console.log('Connected to MongoDB...');

        // Create a test practitioner if none exists
        let practitioner = await User.findOne({ email: 'doctor@test.com' });
        if (!practitioner) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            
            practitioner = new User({
                name: 'Dr. Test',
                email: 'doctor@test.com',
                password: hashedPassword,
                userType: 'practitioner',
                phone: '+919876543210'
            });
            await practitioner.save();
            console.log('Created test practitioner:', practitioner.email);
        } else {
            console.log('Found existing practitioner:', practitioner.email);
        }

        // Create some test patients if none exist
        const testPatients = [
            { name: 'Patient One', email: 'patient1@test.com' },
            { name: 'Patient Two', email: 'patient2@test.com' },
            { name: 'Patient Three', email: 'patient3@test.com' }
        ];

        for (const patientData of testPatients) {
            let patient = await User.findOne({ email: patientData.email });
            if (!patient) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('password123', salt);
                
                patient = new User({
                    name: patientData.name,
                    email: patientData.email,
                    password: hashedPassword,
                    userType: 'patient',
                    phone: '+91987654321' + testPatients.indexOf(patientData),
                    assignedPractitioner: practitioner._id // Assign to our test practitioner
                });
                await patient.save();
                console.log('Created test patient:', patient.email);
            } else {
                // Ensure patient is assigned to practitioner
                if (!patient.assignedPractitioner) {
                    patient.assignedPractitioner = practitioner._id;
                    await patient.save();
                    console.log('Assigned existing patient to practitioner:', patient.email);
                } else {
                    console.log('Patient already exists and is assigned:', patient.email);
                }
            }
        }

        // List all users for verification
        console.log('\nCurrent Users in System:');
        const users = await User.find().select('name email userType assignedPractitioner');
        users.forEach(user => {
            console.log(`- ${user.name} (${user.email})`);
            console.log(`  Type: ${user.userType}`);
            console.log(`  Assigned To: ${user.assignedPractitioner || 'None'}\n`);
        });

        console.log('\nTest Credentials:');
        console.log('Practitioner Login:');
        console.log('Email: doctor@test.com');
        console.log('Password: password123');
        console.log('\nPatient Logins:');
        console.log('Email: patient1@test.com (or patient2@test.com, patient3@test.com)');
        console.log('Password: password123');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

main();