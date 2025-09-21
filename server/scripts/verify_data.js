const mongoose = require('mongoose');
const config = require('../config/default.json');
const User = require('../models/User');

async function main() {
    try {
        await mongoose.connect(config.mongoURI);
        console.log('Connected to MongoDB...');

        // 1. Check practitioner
        const practitioner = await User.findOne({ userType: 'practitioner' });
        console.log('\nPractitioner check:');
        if (practitioner) {
            console.log('Found practitioner:', {
                _id: practitioner._id,
                name: practitioner.name,
                email: practitioner.email,
                userType: practitioner.userType
            });
        } else {
            console.log('No practitioner found');
        }

        // 2. Check patients
        const patients = await User.find({ userType: 'patient' });
        console.log('\nPatient check:');
        if (patients.length > 0) {
            patients.forEach(p => {
                console.log('Patient:', {
                    _id: p._id,
                    name: p.name,
                    email: p.email,
                    assignedPractitioner: p.assignedPractitioner
                });
            });
        } else {
            console.log('No patients found');
        }

        // 3. Check assigned patients
        if (practitioner) {
            const assignedPatients = await User.find({
                userType: 'patient',
                assignedPractitioner: practitioner._id
            });
            console.log('\nAssigned patients check:');
            console.log('Patients assigned to practitioner:', assignedPatients.length);
            assignedPatients.forEach(p => {
                console.log('Assigned patient:', {
                    _id: p._id,
                    name: p.name,
                    email: p.email
                });
            });
        }

        // 4. Create test data if none exists
        if (!practitioner || patients.length === 0) {
            console.log('\nCreating test data...');
            
            // Create practitioner if needed
            if (!practitioner) {
                const newPractitioner = new User({
                    name: 'Test Doctor',
                    email: 'doctor@test.com',
                    password: '$2a$10$YourHashedPasswordHere', // You should hash this properly
                    userType: 'practitioner',
                    phone: '+919876543210'
                });
                await newPractitioner.save();
                console.log('Created test practitioner:', newPractitioner.email);
                practitioner = newPractitioner;
            }

            // Create test patients if needed
            if (patients.length === 0) {
                const testPatients = [
                    { name: 'Test Patient 1', email: 'patient1@test.com' },
                    { name: 'Test Patient 2', email: 'patient2@test.com' }
                ];

                for (const p of testPatients) {
                    const newPatient = new User({
                        name: p.name,
                        email: p.email,
                        password: '$2a$10$YourHashedPasswordHere', // You should hash this properly
                        userType: 'patient',
                        assignedPractitioner: practitioner._id
                    });
                    await newPatient.save();
                    console.log('Created test patient:', newPatient.email);
                }
            }
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

main();