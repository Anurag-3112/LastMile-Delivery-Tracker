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

const markNotificationSent =
    async ({
        notificationId,
        providerMessageId = null,
    }) => {
        return Notification.findByIdAndUpdate(
            notificationId,
            {
                status: "SENT",
                providerMessageId,
                failureReason: null,
                sentAt: new Date(),
            },
            {
                new: true,
            }
        );
    };

const markNotificationFailed =
    async ({
        notificationId,
        failureReason,
    }) => {
        return Notification.findByIdAndUpdate(
            notificationId,
            {
                status: "FAILED",
                failureReason:
                    failureReason ||
                    "Notification delivery failed",
            },
            {
                new: true,
            }
        );
    };

module.exports = {
    createNotification,
    markNotificationSent,
    markNotificationFailed,
};