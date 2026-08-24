const crypto =
    require("crypto");

const {
    getChannel,
} = require("../../config/rabbitmq");

const publishOrderStatusEvent =
    async ({
        orderId,
        customerId,
        status,
        reason = null,
    }) => {
        const channel =
            getChannel();

        const event = {
            eventId:
                crypto.randomUUID(),

            eventType:
                "ORDER_STATUS_CHANGED",

            orderId:
                orderId.toString(),

            customerId:
                customerId.toString(),

            status,

            reason,

            timestamp:
                new Date().toISOString(),
        };

        const routingKey =
            `order.${status.toLowerCase()}`;

        channel.publish(
            "lastmile.events",
            routingKey,
            Buffer.from(
                JSON.stringify(event)
            ),
            {
                persistent: true,
                contentType:
                    "application/json",
            }
        );

        return event;
    };

module.exports = {
    publishOrderStatusEvent,
};