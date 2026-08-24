const Order = require("../../models/Order");

const trackingService =
    require("../tracking/tracking.service");

const {
    releaseAgent,
} = require("../assignment/assignment.service");

const {
    canTransition,
} = require("./order.state");

const {
    publishOrderStatusEvent,
} = require("../notifications/notification.publisher");

const updateAgentOrderStatus = async ({
    orderId,
    agentId,
    nextStatus,
    metadata = {},
    reason,
}) => {
    const order =
        await Order.findById(orderId);

    if (!order) {
        const error = new Error(
            "Order not found"
        );

        error.statusCode = 404;
        error.code = "ORDER_NOT_FOUND";

        throw error;
    }

    if (
        !order.assignment.agentId ||
        order.assignment.agentId.toString() !==
        agentId.toString()
    ) {
        const error = new Error(
            "Order is not assigned to this agent"
        );

        error.statusCode = 403;
        error.code = "ORDER_NOT_ASSIGNED";

        throw error;
    }

    if (
        !canTransition(
            order.status,
            nextStatus
        )
    ) {
        const error = new Error(
            `Cannot transition order from ${order.status} to ${nextStatus}`
        );

        error.statusCode = 400;
        error.code =
            "INVALID_STATUS_TRANSITION";

        throw error;
    }

    order.status = nextStatus;

    await order.save();

    await trackingService.createTrackingEvent({
        orderId: order._id,
        status: nextStatus,
        actorId: agentId,
        actorRole: "DELIVERY_AGENT",
        metadata,
    });

    await publishOrderStatusEvent({
        orderId: order._id,
        customerId: order.customerId,
        status: nextStatus,
        reason,
    });

    if (
        ["FAILED", "DELIVERED"].includes(
            nextStatus
        )
    ) {
        await releaseAgent({
            agentId,
        });
    }

    return order;
};

module.exports = {
    updateAgentOrderStatus,
};