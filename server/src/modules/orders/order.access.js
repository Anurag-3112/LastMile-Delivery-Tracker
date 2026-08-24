const {
    canViewOrder,
} = require("../orders/order.access");

const getOrderTracking = async ({
    orderId,
    userId,
    role,
}) => {
    const order =
        await Order.findById(orderId);

    if (!order) {
        const error = new Error(
            "Order not found"
        );

        error.statusCode = 404;
        error.code =
            "ORDER_NOT_FOUND";

        throw error;
    }

    const canView =
        canViewOrder({
            order,
            user: {
                _id: userId,
                role,
            },
        });

    if (!canView) {
        const error = new Error(
            "Access denied"
        );

        error.statusCode = 403;
        error.code =
            "ORDER_ACCESS_DENIED";

        throw error;
    }

    return TrackingEvent.find({
        orderId,
    })
        .populate(
            "actorId",
            "name role"
        )
        .sort({
            createdAt: 1,
        });
};