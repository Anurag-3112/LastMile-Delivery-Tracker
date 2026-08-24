const orderService = require("./order.service");
const orderStatusService = require("./order.status.service");

const createOrder = async (req, res, next) => {
    try {
        const order =
            await orderService.createOrder({
                customerId: req.user._id,
                ...req.body,
            });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: {
                order,
            },
        });
    } catch (error) {
        next(error);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const order =
            await orderStatusService.updateAgentOrderStatus({
                orderId: req.params.orderId,
                agentId: req.user._id,
                nextStatus: req.body.status,
                metadata: {
                    reason: req.body.reason,
                },
            });

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: {
                order,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getOrder = async (
    req,
    res,
    next
) => {
    try {
        const order =
            await orderService.getOrderById({
                orderId:
                    req.params.orderId,

                user: req.user,
            });

        res.status(200).json({
            success: true,

            data: {
                order,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getCustomerOrders = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await orderService
                .getCustomerOrders({
                    customerId:
                        req.user._id,

                    page:
                        Number(
                            req.query.page
                        ) || 1,

                    limit:
                        Number(
                            req.query.limit
                        ) || 10,
                });

        res.status(200).json({
            success: true,

            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    updateStatus,
    getOrder,
    getCustomerOrders,
};