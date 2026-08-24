const rescheduleService =
    require("./order.reschedule.service");

const rescheduleOrder = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await rescheduleService
                .rescheduleOrder({
                    orderId:
                        req.params.orderId,

                    customerId:
                        req.user._id,

                    newDeliveryDate:
                        req.body.newDeliveryDate,

                    reason:
                        req.body.reason,
                });

        res.status(200).json({
            success: true,

            message:
                "Order rescheduled successfully",

            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    rescheduleOrder,
};