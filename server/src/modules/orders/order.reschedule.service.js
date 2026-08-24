const Order =
    require("../../models/Order");

const Reschedule =
    require("../../models/Reschedule");

const AgentProfile =
    require("../../models/AgentProfile");

const trackingService =
    require("../tracking/tracking.service");

const assignmentService =
    require("../assignment/assignment.service");

const releaseAgentFromOrder = async ({
    agentId,
}) => {
    const profile =
        await AgentProfile.findOneAndUpdate(
            {
                userId: agentId,

                activeOrderCount: {
                    $gt: 0,
                },
            },
            {
                $inc: {
                    activeOrderCount: -1,
                },
            },
            {
                new: true,
            }
        );

    if (!profile) {
        return null;
    }

    if (
        profile.activeOrderCount === 0
    ) {
        profile.availability =
            "AVAILABLE";

        await profile.save();
    }

    return profile;
};

const rescheduleOrder = async ({
    orderId,
    customerId,
    newDeliveryDate,
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
        order.customerId.toString() !==
        customerId.toString()
    ) {
        const error = new Error(
            "You cannot reschedule this order"
        );

        error.statusCode = 403;
        error.code = "ORDER_ACCESS_DENIED";

        throw error;
    }

    if (order.status !== "FAILED") {
        const error = new Error(
            "Only failed orders can be rescheduled"
        );

        error.statusCode = 400;
        error.code =
            "ORDER_NOT_ELIGIBLE_FOR_RESCHEDULE";

        throw error;
    }

    const existingAttempts =
        await Reschedule.countDocuments({
            orderId: order._id,
        });

    const attemptNumber =
        existingAttempts + 1;

    const previousAgentId =
        order.assignment?.agentId || null;

    const previousDeliveryDate =
        order.deliveryDate || null;

    const reschedule =
        await Reschedule.create({
            orderId: order._id,

            attemptNumber,

            previousDeliveryDate,

            newDeliveryDate:
                new Date(newDeliveryDate),

            reason,

            requestedBy: customerId,
        });

    if (previousAgentId) {
        await releaseAgentFromOrder({
            agentId: previousAgentId,
        });
    }

    order.assignment = {
        agentId: null,
        method: null,
        assignedAt: null,
        assignedBy: null,
    };

    order.status = "CREATED";

    order.deliveryDate =
        new Date(newDeliveryDate);

    await order.save();

    await trackingService.createTrackingEvent({
        orderId: order._id,

        status: "CREATED",

        actorId: customerId,

        actorRole: "CUSTOMER",

        metadata: {
            eventType: "RESCHEDULED",

            attemptNumber,

            newDeliveryDate,

            reason,
        },
    });

    let reassignedOrder = null;

    try {
        reassignedOrder =
            await assignmentService
                .assignNearestAgent({
                    orderId: order._id,
                });
    } catch (error) {
        if (
            error.code !==
            "NO_AGENT_AVAILABLE"
        ) {
            throw error;
        }
    }

    return {
        order:
            reassignedOrder || order,

        reschedule,
    };
};

module.exports = {
    rescheduleOrder,
    releaseAgentFromOrder,
};