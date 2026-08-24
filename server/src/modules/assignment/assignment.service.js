const AgentProfile =
    require("../../models/AgentProfile");

const Order =
    require("../../models/Order");

const trackingService =
    require("../tracking/tracking.service");

const {
    publishOrderStatusEvent,
} = require("../notifications/notification.publisher");

const {
    calculateDistanceKm,
} = require("../../utils/distance");

const assignNearestAgent = async ({
    orderId,
    assignmentMetadata = {},
}) => {
    const order =
        await Order.findById(orderId);

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

    const candidates =
        await getAvailableCandidates({
            pickupZoneId:
                order.pickup.zoneId,

            pickupLatitude:
                order.pickup.latitude,

            pickupLongitude:
                order.pickup.longitude,
        });

    if (!candidates.length) {
        return order;
    }

    for (const candidate of candidates) {
        const claimed =
            await claimAgent({
                agentProfileId:
                    candidate.profile._id,
            });

        if (!claimed) {
            continue;
        }

        try {
            order.assignment = {
                agentId:
                    claimed.userId,

                method: "AUTO",

                assignedAt:
                    new Date(),

                assignedBy: null,
            };

            order.status =
                "ASSIGNED";

            await order.save();

            await trackingService.createTrackingEvent({
                orderId:
                    order._id,

                status:
                    "ASSIGNED",

                actorId:
                    null,

                actorRole:
                    "SYSTEM",

                metadata: {
                    assignmentMethod:
                        "AUTO",

                    agentId:
                        claimed.userId,

                    distanceKm:
                        candidate.distance,

                    ...assignmentMetadata,
                },
            });

            await publishOrderStatusEvent({
                orderId:
                    order._id,

                customerId:
                    order.customerId,

                status:
                    "ASSIGNED",
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
                        activeOrderCount:
                            -1,
                    },
                }
            );

            throw error;
        }
    }

    return order;
};

const claimAgent = async ({
    agentProfileId,
}) => {
    return AgentProfile.findOneAndUpdate(
        {
            _id: agentProfileId,

            availability:
                "AVAILABLE",

            $expr: {
                $lt: [
                    "$activeOrderCount",
                    "$maxConcurrentOrders",
                ],
            },
        },

        {
            $set: {
                availability:
                    "BUSY",
            },

            $inc: {
                activeOrderCount:
                    1,
            },
        },

        {
            new: true,
        }
    );
};

const getAvailableCandidates =
    async ({
        pickupZoneId,
        pickupLatitude,
        pickupLongitude,
    }) => {
        const profiles =
            await AgentProfile.find({
                availability:
                    "AVAILABLE",
            }).populate(
                "userId",
                "name email role isActive"
            );

        const validProfiles =
            profiles.filter(
                (profile) =>
                    profile.userId &&
                    profile.userId.isActive &&
                    profile.userId.role ===
                    "DELIVERY_AGENT"
            );

        const coordinateCandidates =
            validProfiles.filter(
                (profile) =>
                    profile.currentLocation
                        ?.latitude != null &&
                    profile.currentLocation
                        ?.longitude != null &&
                    pickupLatitude != null &&
                    pickupLongitude != null
            );

        if (
            coordinateCandidates.length >
            0
        ) {
            return coordinateCandidates
                .map((profile) => ({
                    profile,

                    distance:
                        calculateDistanceKm(
                            pickupLatitude,
                            pickupLongitude,

                            profile
                                .currentLocation
                                .latitude,

                            profile
                                .currentLocation
                                .longitude
                        ),
                }))
                .sort(
                    (a, b) =>
                        a.distance -
                        b.distance
                );
        }

        return validProfiles
            .filter(
                (profile) =>
                    profile.currentZoneId &&
                    pickupZoneId &&
                    profile.currentZoneId
                        .toString() ===
                    pickupZoneId.toString()
            )
            .map((profile) => ({
                profile,

                distance: 0,
            }));
    };

const releaseAgent = async ({
    agentId,
}) => {
    const profile =
        await AgentProfile.findOne({
            userId: agentId,
        });

    if (!profile) {
        return null;
    }

    if (
        profile.activeOrderCount > 0
    ) {
        profile.activeOrderCount -= 1;
    }

    if (
        profile.activeOrderCount === 0
    ) {
        profile.availability =
            "AVAILABLE";
    }

    await profile.save();

    return profile;
};

module.exports = {
    assignNearestAgent,
    claimAgent,
    getAvailableCandidates,
    releaseAgent,
};