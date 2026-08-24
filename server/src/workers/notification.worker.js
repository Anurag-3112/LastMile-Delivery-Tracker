const {
    connectRabbitMQ,
} = require("../config/rabbitmq");

const connectDatabase =
    require("../config/db");

const Notification =
    require("../models/Notification");

const Order =
    require("../models/Order");

const {
    sendEmail,
} = require(
    "../modules/notifications/providers/email.provider"
);

const {
    sendSMS,
} = require(
    "../modules/notifications/providers/sms.provider"
);

const startWorker = async () => {
    await connectDatabase();

    const channel =
        await connectRabbitMQ();

    await channel.assertExchange(
        "lastmile.events",
        "topic",
        {
            durable: true,
        }
    );

    await channel.assertQueue(
        "notification.worker",
        {
            durable: true,
        }
    );

    await channel.bindQueue(
        "notification.worker",
        "lastmile.events",
        "order.*"
    );

    channel.prefetch(10);

    console.log(
        "Notification worker started"
    );

    channel.consume(
        "notification.worker",
        async (message) => {
            if (!message) {
                return;
            }

            try {
                const event =
                    JSON.parse(
                        message.content.toString()
                    );

                await processEvent(event);

                channel.ack(message);
            } catch (error) {
                console.error(
                    "Notification processing failed:",
                    error
                );

                channel.nack(
                    message,
                    false,
                    true
                );
            }
        }
    );
};

const processEvent = async (event) => {
    const order =
        await Order.findById(
            event.orderId
        ).populate(
            "customerId",
            "name email phone"
        );

    if (!order) {
        throw new Error(
            "Order not found"
        );
    }

    const customer =
        order.customerId;

    if (!customer) {
        throw new Error(
            "Customer not found"
        );
    }

    const message =
        buildNotificationMessage(
            event,
            order
        );

    await sendNotification({
        event,
        customer,
        message,
    });
};

const buildNotificationMessage = (
    event,
    order
) => {
    const orderNumber =
        order.orderNumber;

    switch (event.status) {
        case "CREATED":
            return {
                subject:
                    `Order ${orderNumber} created`,

                text:
                    `Your order ${orderNumber} has been created successfully.`,
            };

        case "ASSIGNED":
            return {
                subject:
                    `Order ${orderNumber} assigned`,

                text:
                    `A delivery agent has been assigned to your order ${orderNumber}.`,
            };

        case "PICKED_UP":
            return {
                subject:
                    `Order ${orderNumber} picked up`,

                text:
                    `Your package has been picked up.`,
            };

        case "IN_TRANSIT":
            return {
                subject:
                    `Order ${orderNumber} is in transit`,

                text:
                    `Your package is currently in transit.`,
            };

        case "OUT_FOR_DELIVERY":
            return {
                subject:
                    `Order ${orderNumber} is out for delivery`,

                text:
                    `Your package is out for delivery.`,
            };

        case "DELIVERED":
            return {
                subject:
                    `Order ${orderNumber} delivered`,

                text:
                    `Your package has been delivered successfully.`,
            };

        case "FAILED":
            return {
                subject:
                    `Delivery failed for ${orderNumber}`,

                text:
                    `Your delivery attempt failed. Reason: ${event.reason ||
                    "Not specified"
                    }. You can reschedule your delivery from your dashboard.`,
            };

        default:
            return {
                subject:
                    `Order ${orderNumber} update`,

                text:
                    `Your order status is now ${event.status}.`,
            };
    }
};

const sendNotification = async ({
    event,
    customer,
    message,
}) => {
    if (customer.email) {
        const notification =
            await Notification.create({
                orderId:
                    event.orderId,

                userId:
                    event.customerId,

                type:
                    event.status,

                channel:
                    "EMAIL",

                status:
                    "PENDING",
            });

        try {
            const result =
                await sendEmail({
                    to:
                        customer.email,

                    subject:
                        message.subject,

                    text:
                        message.text,
                });

            notification.status =
                "SENT";

            notification.providerMessageId =
                result?.providerMessageId;

            notification.sentAt =
                new Date();

            await notification.save();
        } catch (error) {
            notification.status =
                "FAILED";

            notification.failureReason =
                error.message;

            await notification.save();

            throw error;
        }
    }

    if (customer.phone) {
        const notification =
            await Notification.create({
                orderId:
                    event.orderId,

                userId:
                    event.customerId,

                type:
                    event.status,

                channel:
                    "SMS",

                status:
                    "PENDING",
            });

        try {
            const result =
                await sendSMS({
                    to:
                        customer.phone,

                    message:
                        message.text,
                });

            notification.status =
                "SENT";

            notification.providerMessageId =
                result?.providerMessageId;

            notification.sentAt =
                new Date();

            await notification.save();
        } catch (error) {
            notification.status =
                "FAILED";

            notification.failureReason =
                error.message;

            await notification.save();

            throw error;
        }
    }
};

startWorker();