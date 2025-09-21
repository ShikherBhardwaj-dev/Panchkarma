require('dotenv').config();
const twilio = require('twilio');

async function sendTestMessage() {
    try {
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        const message = await client.messages.create({
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+919430258280',
            body: '🙏 Ayursutra Test Message 🙏\n\nThis is a test message to verify WhatsApp connectivity.\n\nPlease reply "OK" if you receive this message.'
        });

        console.log('Message sent with SID:', message.sid);
        console.log('Status:', message.status);
        
        // Wait for 5 seconds and check message status
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const updatedMessage = await client.messages(message.sid).fetch();
        console.log('Updated status:', updatedMessage.status);
        console.log('Error (if any):', updatedMessage.errorMessage || 'None');
        
    } catch (error) {
        console.error('Error:', {
            message: error.message,
            code: error.code,
            status: error.status,
            moreInfo: error.moreInfo
        });
    }
}

sendTestMessage();