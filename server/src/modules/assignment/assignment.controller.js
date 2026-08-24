const assignSpecificAgent = async ({
    orderId,
    agentId,
    adminId,
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
        !["CREATED", "FAILED"].includes(
            order.status
        )
    ) {
        const error = new Error(
            `Order cannot be assigned from ${order.status}`
        );

        error.statusCode = 400;
        error.code =
            "INVALID_ASSIGNMENT_STATE";

        throw error;
    }

    const agentProfile =
        await AgentProfile.findOne({
            userId: agentId,
        });

    if (!agentProfile) {
        const error = new Error(
            "Agent profile not found"
        );

        error.statusCode = 404;
        error.code =
            "AGENT_PROFILE_NOT_FOUND";

        throw error;
    }

    const claimed =
        await AgentProfile.findOneAndUpdate(
            {
                _id: agentProfile._id,
                availability: "AVAILABLE",
            },
            {
                $set: {
                    availability: "BUSY",
                },

                $inc: {
                    activeOrderCount: 1,
                },
            },
            {
                new: true,
            }
        );

    if (!claimed) {
        const error = new Error(
            "Agent is no longer available"
        );

        error.statusCode = 409;
        error.code =
            "AGENT_NOT_AVAILABLE";

        throw error;
    }

    try {
        order.assignment = {
            agentId,
            method: "MANUAL",
            assignedAt: new Date(),
            assignedBy: adminId,
        };

        order.status = "ASSIGNED";

        await order.save();

        await trackingService.createTrackingEvent({
            orderId: order._id,
            status: "ASSIGNED",
            actorId: adminId,
            actorRole: "ADMIN",
            metadata: {
                assignmentMethod:
                    "MANUAL",

                agentId,
            },
        });

        return order;
    } catch (error) {
        await AgentProfile.findByIdAndUpdate(
            claimed._id,
            {
                $set: {
                    availability:
                        "AVAILABLE",
                },

                $inc: {
                    activeOrderCount: -1,
                },
            }
        );

        throw error;
    }
};

const assignmentService =
    require("./assignment.service");

const autoAssign = async (
    req,
    res,
    next
) => {
    try {
        const order =
            await assignmentService
                .assignNearestAgent({
                    orderId:
                        req.params.orderId,
                });

        res.status(200).json({
            success: true,
            message:
                "Agent assigned successfully",
            data: {
                order,
            },
        });
    } catch (error) {
        next(error);
    }
};

const manualAssign = async (
    req,
    res,
    next
) => {
    try {
        const order =
            await assignmentService
                .assignSpecificAgent({
                    orderId:
                        req.params.orderId,

                    agentId:
                        req.body.agentId,

                    adminId:
                        req.user._id,
                });

        res.status(200).json({
            success: true,
            message:
                "Agent assigned successfully",
            data: {
                order,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    autoAssign,
    manualAssign,
};