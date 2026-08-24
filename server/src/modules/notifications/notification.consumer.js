const {
    getChannel,
} = require("../../config/rabbitmq");

const User =
    require("../../models/User");

const {
    createNotification,
    markNotificationSent,
    markNotificationFailed,
} = require("./notification.service");

const {
    sendEmail,
} = require("./providers/email.provider");

const {
    sendSMS,
} = require("./providers/sms.provider");

const QUEUE_NAME =
    "lastmile.notifications";

const EXCHANGE_NAME =
    "lastmile.events";

const ROUTING_PATTERN =
    "order.*";

const STATUS_TO_NOTIFICATION_TYPE = {
    CREATED: "ORDER_CREATED",
    ASSIGNED: "ORDER_ASSIGNED",
    PICKED_UP: "PICKED_UP",
    IN_TRANSIT: "IN_TRANSIT",
    OUT_FOR_DELIVERY:
        "OUT_FOR_DELIVERY",
    DELIVERED: "DELIVERED",
    FAILED: "FAILED",
};

const buildNotificationMessage = ({
    orderId,
    status,
    reason,
}) => {
    const readableStatus =
        status
            .replaceAll("_", " ")
            .toLowerCase();

    let subject =
        `Shipment ${orderId} status update`;

    let text =
        `Your shipment ${orderId} is now ${readableStatus}.`;

    if (
        status === "FAILED"
    ) {
        subject =
            `Delivery failed for shipment ${orderId}`;

        text =
            `Your shipment ${orderId} could not be delivered.`;

        if (reason) {
            text +=
                `\n\nReason: ${reason}`;
        }

        text +=
            `\n\nPlease log in to your LastMile account to reschedule your delivery.`;
    }

    if (
        status === "DELIVERED"
    ) {
        subject =
            `Shipment ${orderId} delivered`;

        text =
            `Your shipment ${orderId} has been successfully delivered.`;
    }

    return {
        subject,
        text,
    };
};

const processOrderStatusEvent =
    async (event) => {
        if (
            event.eventType !==
            "ORDER_STATUS_CHANGED"
        ) {
            return;
        }

        const notificationType =
            STATUS_TO_NOTIFICATION_TYPE[
            event.status
            ];

        if (!notificationType) {
            throw new Error(
                `Unsupported notification status: ${event.status}`
            );
        }

        const customer =
            await User.findById(
                event.customerId
            );

        if (!customer) {
            throw new Error(
                `Customer not found: ${event.customerId}`
            );
        }

        const {
            subject,
            text,
        } =
            buildNotificationMessage({
                orderId:
                    event.orderId,

                status:
                    event.status,

                reason:
                    event.reason,
            });

        /*
         * EMAIL
         */
        const emailNotification =
            await createNotification({
                orderId:
                    event.orderId,

                userId:
                    event.customerId,

                type:
                    notificationType,

                channel:
                    "EMAIL",
            });

        try {
            const emailResult =
                await sendEmail({
                    to:
                        customer.email,

                    subject,

                    text,
                });

            await markNotificationSent({
                notificationId:
                    emailNotification._id,

                providerMessageId:
                    emailResult
                        ?.messageId ||
                    null,
            });

            console.log(
                `[EMAIL] Sent to ${customer.email}`
            );
        } catch (error) {
            await markNotificationFailed({
                notificationId:
                    emailNotification._id,

                failureReason:
                    error.message,
            });

            console.error(
                `[EMAIL] Failed for ${event.orderId}:`,
                error.message
            );
        }

        /*
         * SMS
         */
        if (customer.phone) {
            const smsNotification =
                await createNotification({
                    orderId:
                        event.orderId,

                    userId:
                        event.customerId,

                    type:
                        notificationType,

                    channel:
                        "SMS",
                });

            try {
                const smsResult =
                    await sendSMS({
                        to:
                            customer.phone,

                        message:
                            text,
                    });

                await markNotificationSent({
                    notificationId:
                        smsNotification._id,

                    providerMessageId:
                        smsResult
                            ?.messageId ||
                        null,
                });

                console.log(
                    `[SMS] Sent to ${customer.phone}`
                );
            } catch (error) {
                await markNotificationFailed({
                    notificationId:
                        smsNotification._id,

                    failureReason:
                        error.message,
                });

                console.error(
                    `[SMS] Failed for ${event.orderId}:`,
                    error.message
                );
            }
        } else {
            console.log(
                `[SMS] Customer ${event.customerId} has no phone number`
            );
        }
    };

const startNotificationConsumer =
    async () => {
        const channel =
            getChannel();

        await channel.assertQueue(
            QUEUE_NAME,
            {
                durable: true,
            }
        );

        await channel.bindQueue(
            QUEUE_NAME,
            EXCHANGE_NAME,
            ROUTING_PATTERN
        );

        channel.prefetch(1);

        console.log(
            `Notification consumer listening on ${QUEUE_NAME}`
        );

        channel.consume(
            QUEUE_NAME,
            async (message) => {
                if (!message) {
                    return;
                }

                try {
                    const event =
                        JSON.parse(
                            message.content.toString()
                        );

                    console.log(
                        `[NOTIFICATION] Processing ${event.eventType} for order ${event.orderId}`
                    );

                    await processOrderStatusEvent(
                        event
                    );

                    channel.ack(
                        message
                    );

                    console.log(
                        `[NOTIFICATION] Processed ${event.eventId}`
                    );
                } catch (error) {
                    console.error(
                        "[NOTIFICATION] Processing failed:",
                        error.message
                    );

                    /*
                     * Acknowledge malformed or
                     * permanently invalid events
                     * so they don't loop forever.
                     */
                    channel.ack(
                        message
                    );
                }
            }
        );
    };

module.exports = {
    startNotificationConsumer,
    processOrderStatusEvent,
};