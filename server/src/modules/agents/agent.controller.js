const agentService =
    require("./agent.service");

const getProfile = async (
    req,
    res,
    next
) => {
    try {
        const profile =
            await agentService.getAgentProfile(
                req.user._id
            );

        res.status(200).json({
            success: true,
            data: {
                profile,
            },
        });
    } catch (error) {
        next(error);
    }
};

const updateAvailability = async (
    req,
    res,
    next
) => {
    try {
        const profile =
            await agentService.updateAvailability({
                userId: req.user._id,
                availability:
                    req.body.availability,
            });

        res.status(200).json({
            success: true,
            message:
                "Availability updated successfully",
            data: {
                profile,
            },
        });
    } catch (error) {
        next(error);
    }
};

const updateLocation = async (
    req,
    res,
    next
) => {
    try {
        const profile =
            await agentService.updateLocation({
                userId: req.user._id,
                latitude:
                    req.body.latitude,
                longitude:
                    req.body.longitude,
                zoneId:
                    req.body.zoneId,
            });

        res.status(200).json({
            success: true,
            message:
                "Location updated successfully",
            data: {
                profile,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getAssignedOrders =
    async (
        req,
        res,
        next
    ) => {
        try {
            const orders =
                await agentService
                    .getAssignedOrders(
                        req.user._id
                    );

            res.status(200).json({
                success: true,

                data: {
                    orders,
                },
            });
        } catch (error) {
            next(error);
        }
    };

module.exports = {
    getProfile,
    updateAvailability,
    updateLocation,
    getAssignedOrders,
};