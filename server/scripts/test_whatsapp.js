require('dotenv').config();
const { sendAppointmentConfirmation } = require('../utils/whatsapp');

// Test session object
const testSession = {
    therapyType: 'Virechana',
    sessionName: 'Preparation 1',
    date: '2025-09-22',
    startTime: '10:00',
};

// Replace with the actual phone number you want to test with
const testPhoneNumber = process.env.PRACTITIONER_PHONE.replace('whatsapp:', '');

async function testWhatsAppNotification() {
    try {
        console.log('Sending test WhatsApp message...');
        const response = await sendAppointmentConfirmation(testSession, testPhoneNumber);
        console.log('Message sent successfully!');
        console.log('Message SID:', response.sid);
    } catch (error) {
        console.error('Error sending test message:', error);
    }
}

testWhatsAppNotification();