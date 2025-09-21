require('dotenv').config();
const twilio = require('twilio');

async function verifyTwilioSetup() {
    try {
        console.log('Checking Twilio configuration...');
        
        // Check environment variables
        console.log('\nEnvironment Variables:');
        console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✓ Set' : '✗ Missing');
        console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✓ Set' : '✗ Missing');
        console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER ? '✓ Set' : '✗ Missing');
        
        // Initialize Twilio client
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        
        console.log('\nVerifying Twilio credentials...');
        
        // Try to fetch account info to verify credentials
        const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
        console.log('Account Status:', account.status);
        console.log('Account Type:', account.type);
        
        // Check WhatsApp sender
        console.log('\nWhatsApp Sender Configuration:');
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;
        console.log('From Number:', fromNumber);
        
        // Get recent messages
        console.log('\nChecking recent messages...');
        const messages = await client.messages.list({
            from: fromNumber,
            limit: 5
        });
        
        console.log('\nLast 5 messages:');
        messages.forEach(msg => {
            console.log(`- To: ${msg.to}, Status: ${msg.status}, Error: ${msg.errorMessage || 'None'}`);
        });
        
        // Test sending a new message
        const testNumber = process.argv[2] || '+919430258280';
        console.log('\nSending test message to:', testNumber);
        
        const message = await client.messages.create({
            from: fromNumber,
            to: `whatsapp:${testNumber}`,
            body: 'Ayursutra WhatsApp Test: This is a diagnostic test message. Please respond with "received" if you get this message.'
        });
        
        console.log('\nTest message details:');
        console.log('SID:', message.sid);
        console.log('Status:', message.status);
        console.log('Error:', message.errorMessage || 'None');
        
    } catch (error) {
        console.error('\nError during verification:', {
            message: error.message,
            code: error.code,
            status: error.status,
            details: error.details,
            moreInfo: error.moreInfo
        });
    }
}

verifyTwilioSetup();