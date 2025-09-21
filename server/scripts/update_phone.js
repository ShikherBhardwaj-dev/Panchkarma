require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateUserPhone(email, phoneNumber) {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Remove 'whatsapp:' prefix if present
        phoneNumber = phoneNumber.replace('whatsapp:', '');
        
        const result = await User.findOneAndUpdate(
            { email },
            { phone: phoneNumber },
            { new: true }
        );

        if (result) {
            console.log('User updated successfully:', {
                name: result.name,
                email: result.email,
                phone: result.phone,
                userType: result.userType
            });
        } else {
            console.log('No user found with email:', email);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

const userEmail = process.argv[2];
const phoneNumber = process.argv[3];

if (!userEmail || !phoneNumber) {
    console.log('Usage: node update_phone.js <email> <phone_number>');
    console.log('Example: node update_phone.js user@example.com +1234567890');
    process.exit(1);
}

updateUserPhone(userEmail, phoneNumber);