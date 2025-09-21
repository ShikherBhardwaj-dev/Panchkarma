// Check and optionally assign patients to practitioners
const mongoose = require('mongoose');
const config = require('../config/default.json');
const User = require('../models/User');

async function main() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongoURI);
        console.log('Connected to MongoDB...');

        // List all practitioners
        const practitioners = await User.find({ userType: 'practitioner' }).select('name email _id');
        console.log('\nPractitioners:', practitioners.length ? '' : 'None found');
        practitioners.forEach(p => {
            console.log(`- ${p.name} (${p.email}) [ID: ${p._id}]`);
        });

        // List all patients and their assignments
        const patients = await User.find({ userType: 'patient' }).select('name email assignedPractitioner');
        console.log('\nPatients and their assignments:', patients.length ? '' : 'None found');
        patients.forEach(p => {
            console.log(`- ${p.name} (${p.email}) → ${p.assignedPractitioner ? 'Assigned to: ' + p.assignedPractitioner : 'Not assigned'}`);
        });

        // If command line args provided, assign patient to practitioner
        if (process.argv.length >= 4) {
            const patientEmail = process.argv[2];
            const practitionerEmail = process.argv[3];

            const patient = await User.findOne({ email: patientEmail, userType: 'patient' });
            if (!patient) {
                console.error(`\nError: Patient with email ${patientEmail} not found`);
                process.exit(1);
            }

            const practitioner = await User.findOne({ email: practitionerEmail, userType: 'practitioner' });
            if (!practitioner) {
                console.error(`\nError: Practitioner with email ${practitionerEmail} not found`);
                process.exit(1);
            }

            // Update patient's assignedPractitioner
            patient.assignedPractitioner = practitioner._id;
            await patient.save();
            console.log(`\nSuccess: Assigned patient ${patient.name} to practitioner ${practitioner.name}`);
        }

        // Show current assignments after changes
        if (process.argv.length >= 4) {
            console.log('\nCurrent assignments:');
            const currentPatients = await User.find({ userType: 'patient' })
                .select('name email assignedPractitioner')
                .populate('assignedPractitioner', 'name email');
            
            currentPatients.forEach(p => {
                console.log(`- ${p.name} (${p.email}) → ${p.assignedPractitioner ? 'Assigned to: ' + p.assignedPractitioner.name : 'Not assigned'}`);
            });
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

main();