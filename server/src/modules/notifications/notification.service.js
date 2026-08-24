const Notification =
    require("../../models/Notification");

const createNotification =
    async ({
        orderId,
        userId,
        type,
        channel,
    }) => {
        return Notification.create({
            orderId,
            userId,
            type,
            channel,
            status: "PENDING",
        });
    };

module.exports = {
    createNotification,
};