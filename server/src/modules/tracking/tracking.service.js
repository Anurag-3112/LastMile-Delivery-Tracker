const Order =
    require("../../models/Order");

const TrackingEvent =
    require("../../models/TrackingEvent");

const {
    canViewOrder,
} = require("../../utils/orderAccess");


const createTrackingEvent = async ({
    orderId,
    status,
    actorId = null,
    actorRole,
    metadata = {},
}) => {
    return TrackingEvent.create({
        orderId,
        status,
        actorId,
        actorRole,
        metadata,
    });
};


const getTrackingHistory = async (
    orderId
) => {
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


const getOrderTracking = async ({
    orderId,
    user,
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

    const allowed =
        canViewOrder({
            order,
            user,
        });

    if (!allowed) {
        console.log(
            "TRACKING ACCESS DENIED:",
            {
                orderId,
                userId:
                    user?._id?.toString(),
                userRole:
                    user?.role,
                customerId:
                    order.customerId?.toString(),
                assignedAgentId:
                    order.assignment?.agentId?.toString(),
            }
        );

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


module.exports = {
    createTrackingEvent,
    getTrackingHistory,
    getOrderTracking,
};