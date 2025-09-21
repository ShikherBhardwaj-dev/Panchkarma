import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const listUsers = async () => {
  try {
    await connectDB();
    const users = await User.find({}, 'email name');
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name})`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error listing users:', err);
    process.exit(1);
  }
};

listUsers();
