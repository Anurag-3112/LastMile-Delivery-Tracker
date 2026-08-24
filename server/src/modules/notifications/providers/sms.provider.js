const sendSMS = async ({
    to,
    message,
}) => {
    // Provider implementation will go here.

    console.log(
        `[SMS] ${to} - ${message}`
    );

    return {
        success: true,
    };
};

module.exports = {
    sendSMS,
};