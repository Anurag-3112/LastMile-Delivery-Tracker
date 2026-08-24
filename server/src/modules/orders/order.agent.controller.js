const statusService =
    require("./order.status.service");

const updateStatus = async (
    req,
    res,
    next
) => {
    try {
        const order =
            await statusService.updateAgentOrderStatus({
                orderId: req.params.orderId,

                agentId: req.user._id,

                nextStatus: req.body.status,

                metadata: {
                    reason: req.body.reason,
                },
            });

        return res.status(200).json({
            success: true,
            message:
                "Order status updated successfully",
            data: {
                order,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateStatus,
};