const twilio = require("twilio");

const accountSid =
    process.env.TWILIO_ACCOUNT_SID;

const authToken =
    process.env.TWILIO_AUTH_TOKEN;

const fromNumber =
    process.env.TWILIO_PHONE_NUMBER;

let client = null;

if (accountSid && authToken) {
    client = twilio(
        accountSid,
        authToken
    );
}

const sendSMS = async ({
    to,
    message,
}) => {
    if (!to) {
        throw new Error(
            "Recipient phone number is required"
        );
    }

    if (!client) {
        throw new Error(
            "Twilio is not configured"
        );
    }

    if (!fromNumber) {
        throw new Error(
            "Twilio phone number is not configured"
        );
    }

    const result =
        await client.messages.create({
            body: message,
            from: fromNumber,
            to,
        });

    return {
        success: true,
        messageId: result.sid,
        status: result.status,
    };
};

module.exports = {
    sendSMS,
};