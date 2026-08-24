const Order = require("../../models/Order");
const User = require("../../models/User");
const TrackingEvent = require("../../models/TrackingEvent");

const pricingService = require("../pricing/pricing.service");

const generateOrderNumber = require("../../utils/orderNumber");

const {
    canViewOrder,
} = require("../../utils/orderAccess");

const createOrder = async ({
    customerId,
    pickup,
    drop,
    package: packageData,
    orderType,
    paymentType,
}) => {
    const customer = await User.findOne({
        _id: customerId,
        role: "CUSTOMER",
        isActive: true,
    });

    if (!customer) {
        const error = new Error(
            "Customer account not found"
        );

        error.statusCode = 404;
        error.code = "CUSTOMER_NOT_FOUND";

        throw error;
    }

    const quote =
        await pricingService.calculateQuote({
            pickupAreaId: pickup.areaId,
            dropAreaId: drop.areaId,

            length: packageData.length,
            breadth: packageData.breadth,
            height: packageData.height,

            actualWeight: packageData.actualWeight,

            orderType,
            paymentType,
        });

    const order = await Order.create({
        orderNumber: generateOrderNumber(),

        customerId,

        pickup: {
            address: pickup.address,
            areaId: pickup.areaId,
            zoneId: quote.pickupZone.id,
            latitude: pickup.latitude,
            longitude: pickup.longitude,
        },

        drop: {
            address: drop.address,
            areaId: drop.areaId,
            zoneId: quote.dropZone.id,
            latitude: drop.latitude,
            longitude: drop.longitude,
        },

        package: {
            length: packageData.length,
            breadth: packageData.breadth,
            height: packageData.height,
            actualWeight: packageData.actualWeight,
            volumetricWeight:
                quote.volumetricWeight,
            billableWeight:
                quote.billableWeight,
        },

        orderType,

        paymentType,

        pricing: {
            rateCardId: quote.rateCardId,
            zoneType: quote.zoneType,
            baseCharge: quote.baseCharge,
            codSurcharge: quote.codSurcharge,
            totalCharge: quote.totalCharge,
            currency: quote.currency,
        },

        status: "CREATED",
    });

    await TrackingEvent.create({
        orderId: order._id,
        status: "CREATED",
        actorId: customerId,
        actorRole: "CUSTOMER",
    });

    return order;
};

const getOrderById = async ({
    orderId,
    user,
}) => {
    const order =
        await Order.findById(orderId)
            .populate(
                "customerId",
                "name email phone"
            )
            .populate(
                "assignment.agentId",
                "name email phone"
            )
            .populate(
                "pickup.areaId",
                "name code pincode"
            )
            .populate(
                "pickup.zoneId",
                "name code"
            )
            .populate(
                "drop.areaId",
                "name code pincode"
            )
            .populate(
                "drop.zoneId",
                "name code"
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

    if (
        !canViewOrder({
            order,
            user,
        })
    ) {
        const error = new Error(
            "You do not have access to this order"
        );

        error.statusCode = 403;
        error.code =
            "ORDER_ACCESS_DENIED";

        throw error;
    }

    return order;
};

const getCustomerOrders = async ({
    customerId,
    page = 1,
    limit = 10,
}) => {
    const skip =
        (page - 1) * limit;

    const [
        orders,
        total,
    ] = await Promise.all([
        Order.find({
            customerId,
        })
            .populate(
                "assignment.agentId",
                "name phone"
            )
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit),

        Order.countDocuments({
            customerId,
        }),
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

module.exports = {
    createOrder,
    getOrderById,
    getCustomerOrders,
};