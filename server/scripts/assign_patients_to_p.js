const mongoose = require('mongoose');
const config = require('../config/default.json');
const User = require('../models/User');

async function main() {
    try {
        await mongoose.connect(config.mongoURI);
        console.log('Connected to MongoDB...');

        // Find the practitioner with email p@gmail.com
        const practitioner = await User.findOne({ userType: 'practitioner', email: 'p@gmail.com' });
        if (!practitioner) {
            console.log('No practitioner found with email p@gmail.com. Exiting.');
            process.exit(1);
        }
        console.log('Practitioner:', practitioner._id, practitioner.name);

        // Assign all patients to this practitioner
        const result = await User.updateMany(
            { userType: 'patient' },
            { $set: { assignedPractitioner: practitioner._id } }
        );
        console.log(`Assigned ${result.modifiedCount} patients to practitioner.`);

        // Show updated patients
        const patients = await User.find({ userType: 'patient', assignedPractitioner: practitioner._id });
        patients.forEach(p => {
            console.log('Assigned patient:', p._id, p.name, p.email);
        });
    } catch (err) {
        console.error('Error:', err);
    } finally {
        mongoose.disconnect();
    }
}

main();
