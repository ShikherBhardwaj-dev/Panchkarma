const twilio = require('twilio');
require('dotenv').config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send a WhatsApp message to a specified number
 * @param {string} to - The recipient's phone number (with WhatsApp prefix)
 * @param {string} message - The message to send
 * @returns {Promise} - The Twilio message response
 */
const sendWhatsAppMessage = async (to, message) => {
    try {
        console.log('Attempting to send WhatsApp message:', {
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `whatsapp:${to}`,
            messageLength: message.length
        });
        const response = await client.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `whatsapp:${to}`, // Ensure the number has WhatsApp prefix
            body: message
        });
        console.log('WhatsApp message sent successfully:', response.sid);
        return response;
    } catch (error) {
        console.error('Error sending WhatsApp message:', {
            error: error.message,
            code: error.code,
            status: error.status,
            moreInfo: error.moreInfo,
            details: error.details
        });
        throw error;
    }
};

/**
 * Format and send an appointment confirmation message
 * @param {Object} session - The therapy session details
 * @param {string} phoneNumber - The patient's phone number
 */
const sendAppointmentConfirmation = async (session, phoneNumber) => {
    const message = `
🙏 Appointment Confirmation 🙏

Dear Patient,

Your Ayurvedic therapy session has been scheduled:

Therapy: ${session.therapyType}
Session: ${session.sessionName}
Date: ${session.date}
Time: ${session.startTime}

Location: Ayursutra Wellness Center

Please arrive 15 minutes before your scheduled time.
For any queries, please contact us.

Thank you for choosing Ayursutra!
`;

    return sendWhatsAppMessage(phoneNumber, message);
};

module.exports = {
    sendWhatsAppMessage,
    sendAppointmentConfirmation
};