require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUserDetails(email) {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });
        if (user) {
            console.log('User found:', {
                name: user.name,
                email: user.email,
                phone: user.phone || 'No phone number set',
                userType: user.userType
            });
        } else {
            console.log('No user found with email:', email);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Replace this with your email address
const userEmail = process.argv[2] || 'default.email@example.com';
checkUserDetails(userEmail);