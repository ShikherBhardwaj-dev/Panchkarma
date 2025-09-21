require('dotenv').config();
const { sendWhatsAppMessage } = require('../utils/whatsapp');

async function testSendMessage() {
    try {
        const testMessage = "This is a test message from Ayursutra Wellness Center. If you receive this, your WhatsApp notifications are working correctly.";
        
        // Get the phone number from command line or use default
        const phoneNumber = process.argv[2] || '+919430258280';
        
        console.log(`Attempting to send test message to ${phoneNumber}...`);
        const response = await sendWhatsAppMessage(phoneNumber, testMessage);
        console.log('Test message sent successfully!', response.sid);
    } catch (error) {
        console.error('Error sending test message:', error);
    }
}

testSendMessage();