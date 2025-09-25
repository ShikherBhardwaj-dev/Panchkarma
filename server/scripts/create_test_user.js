const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const testUser = {
  email: 'test@example.com',
  password: 'test1234',
  name: 'Test User',
  userType: 'patient'
};

(async function run() {
  try {
    await connectDB();
    
    // Check if user exists
    const existing = await User.findOne({ email: testUser.email });
    if (existing) {
      console.log('\n✅ Test user already exists:');
      console.log('Email:', existing.email);
      console.log('Name:', existing.name);
      console.log('Type:', existing.userType);
      console.log('\nTry logging in with:');
      console.log('Email:', testUser.email);
      console.log('Pass: ', testUser.password);
      process.exit(0);
    }

    // Create new test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    
    const user = new User({
      ...testUser,
      password: hashedPassword
    });
    
    await user.save();
    
    console.log('\n✅ Created test user:');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Type:', user.userType);
    console.log('\nTry logging in with:');
    console.log('Email:', testUser.email);
    console.log('Pass: ', testUser.password);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();