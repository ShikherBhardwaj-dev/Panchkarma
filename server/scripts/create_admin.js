const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const adminUser = {
  name: "System Admin",
  email: "admin@ayursutra.com",
  password: "admin@123",
  userType: "admin"
};

async function createAdminUser() {
  try {
    await connectDB();
    
    // Check if admin exists
    const exists = await User.findOne({ email: adminUser.email });
    if (exists) {
      console.log('\n✅ Admin user already exists:');
      console.log('Email:', exists.email);
      console.log('Name:', exists.name);
      console.log('\nLogin credentials:');
      console.log('Email:', adminUser.email);
      console.log('Password:', adminUser.password);
      process.exit(0);
    }

    // Create new admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    const admin = new User({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      userType: adminUser.userType,
      status: "active",
      verificationStatus: "verified"
    });

    await admin.save();
    
    console.log('\n✅ Created admin user:');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('\nLogin credentials:');
    console.log('Email:', adminUser.email);
    console.log('Password:', adminUser.password);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createAdminUser();