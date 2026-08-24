const AgentProfile =
    require("../../models/AgentProfile");

const User =
    require("../../models/User");

const Zone =
    require("../../models/Zone");

const Order =
    require("../../models/Order");

const getAssignedOrders =
    async (agentId) => {
        return Order.find({
            "assignment.agentId":
                agentId,

            status: {
                $nin: [
                    "DELIVERED",
                ],
            },
        }).sort({
            createdAt: -1,
        });
    };

const getAgentProfile = async (userId) => {
    const profile =
        await AgentProfile.findOne({
            userId,
        })
            .populate(
                "userId",
                "name email phone role"
            )
            .populate(
                "currentZoneId",
                "name code"
            );

    if (!profile) {
        const error = new Error(
            "Agent profile not found"
        );

        error.statusCode = 404;
        error.code = "AGENT_PROFILE_NOT_FOUND";

        throw error;
    }

    return profile;
};

const updateAvailability = async ({
    userId,
    availability,
}) => {
    const profile =
        await AgentProfile.findOne({
            userId,
        });

    if (!profile) {
        const error = new Error(
            "Agent profile not found"
        );

        error.statusCode = 404;
        error.code = "AGENT_PROFILE_NOT_FOUND";

        throw error;
    }

    profile.availability =
        availability;

    await profile.save();

    return profile;
};

const updateLocation = async ({
    userId,
    latitude,
    longitude,
    zoneId,
}) => {
    const zone =
        await Zone.findOne({
            _id: zoneId,
            isActive: true,
        });

    if (!zone) {
        const error = new Error(
            "Active zone not found"
        );

        error.statusCode = 404;
        error.code = "ZONE_NOT_FOUND";

        throw error;
    }

    const profile =
        await AgentProfile.findOne({
            userId,
        });

    if (!profile) {
        const error = new Error(
            "Agent profile not found"
        );

        error.statusCode = 404;
        error.code = "AGENT_PROFILE_NOT_FOUND";

        throw error;
    }

    profile.currentLocation = {
        latitude,
        longitude,
    };

    profile.currentZoneId = zoneId;

    profile.lastLocationUpdate =
        new Date();

    await profile.save();

    return profile;
};

module.exports = {
    getAgentProfile,
    updateAvailability,
    updateLocation,
    getAssignedOrders,
};