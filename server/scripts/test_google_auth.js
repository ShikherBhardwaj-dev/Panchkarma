const mongoose = require('mongoose');
const User = require('../models/User');
const config = require('../config/default.json');

// Test script to verify Google OAuth setup
async function testGoogleAuthSetup() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoURI);
    console.log('✅ Connected to MongoDB');

    // Test User model with OAuth fields
    const testUser = new User({
      name: 'Test Google User',
      email: 'test@example.com',
      googleId: 'test-google-id-123',
      provider: 'google',
      userType: 'patient'
    });

    // Validate the user (this will test our schema changes)
    const validationError = testUser.validateSync();
    if (validationError) {
      console.error('❌ User model validation failed:', validationError.message);
      return;
    }

    console.log('✅ User model supports OAuth fields');

    // Test password requirement logic
    const oauthUser = new User({
      name: 'OAuth User',
      email: 'oauth@example.com',
      googleId: 'oauth-google-id-456',
      provider: 'google',
      userType: 'patient'
      // No password field - should be valid
    });

    const oauthValidationError = oauthUser.validateSync();
    if (oauthValidationError) {
      console.error('❌ OAuth user validation failed:', oauthValidationError.message);
      return;
    }

    console.log('✅ OAuth users can be created without password');

    // Test local user still requires password
    const localUser = new User({
      name: 'Local User',
      email: 'local@example.com',
      provider: 'local',
      userType: 'patient'
      // No password field - should fail
    });

    const localValidationError = localUser.validateSync();
    if (!localValidationError) {
      console.error('❌ Local user should require password');
      return;
    }

    console.log('✅ Local users still require password');

    console.log('\n🎉 Google OAuth setup verification completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Set up your Google OAuth credentials in Google Cloud Console');
    console.log('2. Create a .env file with your Google Client ID and Secret');
    console.log('3. Start the server and test the OAuth flow');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the test
testGoogleAuthSetup();
