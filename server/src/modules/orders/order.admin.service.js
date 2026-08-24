const Order =
    require("../../models/Order");

const trackingService =
    require("../tracking/tracking.service");

const getAdminOrders = async ({
    status,
    zoneId,
    agentId,
    customerId,
    page = 1,
    limit = 20,
}) => {
    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (zoneId) {
        filter.$or = [
            {
                "pickup.zoneId":
                    zoneId,
            },
            {
                "drop.zoneId":
                    zoneId,
            },
        ];
    }

    if (agentId) {
        filter[
            "assignment.agentId"
        ] = agentId;
    }

    if (customerId) {
        filter.customerId =
            customerId;
    }

    const skip =
        (page - 1) * limit;

    const [
        orders,
        total,
    ] = await Promise.all([
        Order.find(filter)
            .populate(
                "customerId",
                "name email phone"
            )
            .populate(
                "assignment.agentId",
                "name email phone"
            )
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit),

        Order.countDocuments(
            filter
        ),
    ]);

    return {
        orders,

        pagination: {
            page,
            limit,
            total,

            totalPages:
                Math.ceil(
                    total / limit
                ),
        },
    };
};

const overrideOrderStatus =
    async ({
        orderId,
        adminId,
        status,
        reason,
    }) => {
        const order =
            await Order.findById(
                orderId
            );

        if (!order) {
            const error = new Error(
                "Order not found"
            );

            error.statusCode = 404;
            error.code =
                "ORDER_NOT_FOUND";

            throw error;
        }

        const previousStatus =
            order.status;

        order.status = status;

        await order.save();

        await trackingService
            .createTrackingEvent({
                orderId: order._id,

                status,

                actorId: adminId,

                actorRole: "ADMIN",

                metadata: {
                    override: true,

                    previousStatus,

                    reason,
                },
            });

        return order;
    };

module.exports = {
    getAdminOrders,
    overrideOrderStatus,
};