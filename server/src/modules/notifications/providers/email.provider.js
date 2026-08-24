const nodemailer =
    require("nodemailer");

const transporter =
    nodemailer.createTransport({
        host:
            process.env.SMTP_HOST,

        port:
            Number(
                process.env.SMTP_PORT
            ),

        secure:
            process.env.SMTP_SECURE ===
            "true",

        auth: {
            user:
                process.env.SMTP_USER,

            pass:
                process.env.SMTP_PASSWORD,
        },
    });

const sendEmail = async ({
    to,
    subject,
    text,
}) => {
    const result =
        await transporter.sendMail({
            from:
                process.env.SMTP_FROM,

            to,

            subject,

            text,
        });

    return {
        success: true,

        providerMessageId:
            result.messageId,
    };
};

module.exports = {
    sendEmail,
};