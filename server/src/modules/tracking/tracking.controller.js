const trackingService =
    require("./tracking.service");

const getTrackingHistory = async (
    req,
    res,
    next
) => {
    try {
        const events =
            await trackingService.getTrackingHistory(
                req.params.orderId
            );

        res.status(200).json({
            success: true,
            data: {
                events,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getTracking = async (
    req,
    res,
    next
) => {
    try {
        const events =
            await trackingService.getOrderTracking({
                orderId:
                    req.params.orderId,

                user:
                    req.user,
            });

        res.status(200).json({
            success: true,
            data: {
                events,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTrackingHistory,
    getTracking,
};