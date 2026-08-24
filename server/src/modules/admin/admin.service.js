const mongoose = require("mongoose");

const User = require("../../models/User");
const Order = require("../../models/Order");
const AgentProfile = require("../../models/AgentProfile");
const Zone = require("../../models/Zone");
const Area = require("../../models/Area");
const RateCard = require("../../models/RateCard");
const TrackingEvent = require("../../models/TrackingEvent");
const bcrypt = require("bcryptjs");

const getDashboard = async () => {
    const [
        totalOrders,
        createdOrders,
        assignedOrders,
        pickedUpOrders,
        inTransitOrders,
        outForDeliveryOrders,
        deliveredOrders,
        failedOrders,
        availableAgents,
        busyAgents,
        offlineAgents,
    ] = await Promise.all([
        Order.countDocuments(),

        Order.countDocuments({
            status: "CREATED",
        }),

        Order.countDocuments({
            status: "ASSIGNED",
        }),

        Order.countDocuments({
            status: "PICKED_UP",
        }),

        Order.countDocuments({
            status: "IN_TRANSIT",
        }),

        Order.countDocuments({
            status: "OUT_FOR_DELIVERY",
        }),

        Order.countDocuments({
            status: "DELIVERED",
        }),

        Order.countDocuments({
            status: "FAILED",
        }),

        AgentProfile.countDocuments({
            availability: "AVAILABLE",
        }),

        AgentProfile.countDocuments({
            availability: "BUSY",
        }),

        AgentProfile.countDocuments({
            availability: "OFFLINE",
        }),
    ]);

    return {
        orders: {
            total: totalOrders,
            created: createdOrders,
            assigned: assignedOrders,
            pickedUp: pickedUpOrders,
            inTransit: inTransitOrders,
            outForDelivery:
                outForDeliveryOrders,
            delivered: deliveredOrders,
            failed: failedOrders,
        },

        agents: {
            available: availableAgents,
            busy: busyAgents,
            offline: offlineAgents,
            total:
                availableAgents +
                busyAgents +
                offlineAgents,
        },
    };
};

const getOrders = async ({
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

    const safePage =
        Math.max(
            Number(page) || 1,
            1
        );

    const safeLimit =
        Math.min(
            Math.max(
                Number(limit) || 20,
                1
            ),
            100
        );

    const skip =
        (safePage - 1) *
        safeLimit;

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
            .limit(safeLimit)
            .lean(),

        Order.countDocuments(
            filter
        ),
    ]);

    return {
        orders,

        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages:
                Math.ceil(
                    total /
                    safeLimit
                ),
        },
    };
};


const getAgents = async () => {
    return AgentProfile.find()
        .populate(
            "userId",
            "name email phone role isActive"
        )
        .populate(
            "currentZoneId",
            "name code"
        )
        .sort({
            availability: 1,
            updatedAt: -1,
        })
        .lean();
};

const getZones = async () => {
    return Zone.find()
        .sort({
            name: 1,
        })
        .lean();
};

const createZone = async (
    payload
) => {
    return Zone.create(
        payload
    );
};

const updateZone = async (
    zoneId,
    payload
) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            zoneId
        )
    ) {
        throw new Error(
            "Invalid zone ID"
        );
    }

    const zone =
        await Zone.findByIdAndUpdate(
            zoneId,
            payload,
            {
                new: true,
                runValidators: true,
            }
        );

    if (!zone) {
        throw new Error(
            "Zone not found"
        );
    }

    return zone;
};

const getAreas = async () => {
    return Area.find()
        .populate(
            "zoneId",
            "name code"
        )
        .sort({
            name: 1,
        })
        .lean();
};

const createArea = async (
    payload
) => {
    const zone =
        await Zone.findById(
            payload.zoneId
        );

    if (!zone) {
        throw new Error(
            "Zone not found"
        );
    }

    return Area.create(
        payload
    );
};

const updateArea = async (
    areaId,
    payload
) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            areaId
        )
    ) {
        throw new Error(
            "Invalid area ID"
        );
    }

    if (payload.zoneId) {
        const zone =
            await Zone.findById(
                payload.zoneId
            );

        if (!zone) {
            throw new Error(
                "Zone not found"
            );
        }
    }

    const area =
        await Area.findByIdAndUpdate(
            areaId,
            payload,
            {
                new: true,
                runValidators: true,
            }
        ).populate(
            "zoneId",
            "name code"
        );

    if (!area) {
        throw new Error(
            "Area not found"
        );
    }

    return area;
};

const getRateCards =
    async () => {
        return RateCard.find()
            .sort({
                orderType: 1,
                zoneType: 1,
            })
            .lean();
    };

const createRateCard =
    async (payload) => {
        return RateCard.create(
            payload
        );
    };

const updateRateCard =
    async (
        rateCardId,
        payload
    ) => {
        if (
            !mongoose.Types.ObjectId.isValid(
                rateCardId
            )
        ) {
            throw new Error(
                "Invalid rate card ID"
            );
        }

        const rateCard =
            await RateCard.findByIdAndUpdate(
                rateCardId,
                payload,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!rateCard) {
            throw new Error(
                "Rate card not found"
            );
        }

        return rateCard;
    };

const overrideOrderStatus =
    async (
        orderId,
        {
            status,
            reason,
        },
        adminUser
    ) => {
        const order =
            await Order.findById(
                orderId
            );

        if (!order) {
            throw new Error(
                "Order not found"
            );
        }

        const previousStatus =
            order.status;

        if (
            previousStatus ===
            status
        ) {
            throw new Error(
                "Order is already in this status"
            );
        }

        order.status =
            status;

        await order.save();

        await TrackingEvent.create({
            orderId: order._id,

            status,

            actorId:
                adminUser.userId,

            actorRole:
                "ADMIN",

            metadata: {
                source:
                    "ADMIN_OVERRIDE",

                previousStatus,

                reason,
            },
        });

        return order;
    };


const assignAgent = async (
    orderId,
    agentId,
    adminUser
) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            orderId
        )
    ) {
        throw new Error(
            "Invalid order ID"
        );
    }

    if (
        !mongoose.Types.ObjectId.isValid(
            agentId
        )
    ) {
        throw new Error(
            "Invalid agent ID"
        );
    }

    const order =
        await Order.findById(
            orderId
        );

    if (!order) {
        throw new Error(
            "Order not found"
        );
    }

    const agent =
        await User.findOne({
            _id: agentId,
            role: "DELIVERY_AGENT",
            isActive: true,
        });

    if (!agent) {
        throw new Error(
            "Active delivery agent not found"
        );
    }

    const profile =
        await AgentProfile.findOne({
            userId: agent._id,
        });

    if (!profile) {
        throw new Error(
            "Agent profile not found"
        );
    }

    if (
        profile.availability ===
        "OFFLINE"
    ) {
        throw new Error(
            "Agent is currently offline"
        );
    }

    const previousAgentId =
        order.assignment?.agentId ||
        null;

    order.assignment = {
        agentId: agent._id,

        method: "MANUAL",

        assignedAt: new Date(),

        assignedBy:
            adminUser.userId,
    };

    if (
        order.status ===
        "CREATED"
    ) {
        order.status =
            "ASSIGNED";
    }

    await order.save();

    profile.activeOrderCount =
        Math.max(
            0,
            profile.activeOrderCount
        ) + 1;

    if (
        profile.availability ===
        "AVAILABLE"
    ) {
        profile.availability =
            "BUSY";
    }

    await profile.save();

    await TrackingEvent.create({
        orderId: order._id,

        status: "ASSIGNED",

        actorId:
            adminUser.userId,

        actorRole: "ADMIN",

        metadata: {
            assignmentMethod:
                "MANUAL",

            previousAgentId,

            agentId:
                agent._id,
        },
    });

    return Order.findById(
        order._id
    )
        .populate(
            "customerId",
            "name email phone"
        )
        .populate(
            "assignment.agentId",
            "name email phone"
        );
};

const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {
    const toRadians = (value) =>
        (value * Math.PI) / 180;

    const earthRadiusKm = 6371;

    const dLat =
        toRadians(lat2 - lat1);

    const dLon =
        toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(
            toRadians(lat1)
        ) *
        Math.cos(
            toRadians(lat2)
        ) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return (
        earthRadiusKm * c
    );
};

const autoAssignAgent = async (
    orderId,
    adminUser
) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            orderId
        )
    ) {
        throw new Error(
            "Invalid order ID"
        );
    }

    const order =
        await Order.findById(
            orderId
        );

    if (!order) {
        throw new Error(
            "Order not found"
        );
    }

    if (
        order.assignment?.agentId
    ) {
        throw new Error(
            "Order is already assigned"
        );
    }

    const agents =
        await AgentProfile.find({
            availability: "AVAILABLE",
        }).populate(
            "userId",
            "name email phone role isActive"
        );

    const activeAgents =
        agents.filter(
            (profile) =>
                profile.userId &&
                profile.userId.isActive &&
                profile.userId.role ===
                "DELIVERY_AGENT"
        );

    if (
        activeAgents.length === 0
    ) {
        throw new Error(
            "No available delivery agents"
        );
    }

    const pickupZoneId =
        order.pickup?.zoneId;

    const pickupLatitude =
        order.pickup?.latitude;

    const pickupLongitude =
        order.pickup?.longitude;

    const rankedAgents =
        activeAgents
            .map((profile) => {
                const sameZone =
                    pickupZoneId &&
                    profile.currentZoneId &&
                    profile.currentZoneId.toString() ===
                    pickupZoneId.toString();

                let distance = Infinity;

                if (
                    pickupLatitude != null &&
                    pickupLongitude != null &&
                    profile.currentLocation
                        ?.latitude != null &&
                    profile.currentLocation
                        ?.longitude != null
                ) {
                    distance =
                        calculateDistance(
                            pickupLatitude,
                            pickupLongitude,
                            profile.currentLocation
                                .latitude,
                            profile.currentLocation
                                .longitude
                        );
                }

                return {
                    profile,
                    sameZone:
                        sameZone ? 1 : 0,
                    distance,
                    activeOrders:
                        profile.activeOrderCount,
                };
            })
            .sort(
                (a, b) =>
                    b.sameZone -
                    a.sameZone ||
                    a.distance -
                    b.distance ||
                    a.activeOrders -
                    b.activeOrders
            );

    const selected =
        rankedAgents[0];

    const selectedProfile =
        selected.profile;

    const selectedAgent =
        selectedProfile.userId;

    order.assignment = {
        agentId:
            selectedAgent._id,

        method: "AUTO",

        assignedAt: new Date(),

        assignedBy:
            adminUser.userId,
    };

    if (
        order.status ===
        "CREATED"
    ) {
        order.status =
            "ASSIGNED";
    }

    await order.save();

    selectedProfile.activeOrderCount +=
        1;

    selectedProfile.availability =
        "BUSY";

    await selectedProfile.save();

    await TrackingEvent.create({
        orderId: order._id,

        status: "ASSIGNED",

        actorId:
            adminUser.userId,

        actorRole: "ADMIN",

        metadata: {
            assignmentMethod:
                "AUTO",

            selectedAgent:
                selectedAgent._id,

            sameZone:
                selected.sameZone === 1,

            distanceKm:
                Number.isFinite(
                    selected.distance
                )
                    ? selected.distance
                    : null,
        },
    });

    return Order.findById(
        order._id
    )
        .populate(
            "customerId",
            "name email phone"
        )
        .populate(
            "assignment.agentId",
            "name email phone"
        );
};

const createAgent = async (
    payload
) => {
    const email =
        payload.email
            .trim()
            .toLowerCase();

    const phone =
        payload.phone
            .trim();

    const existingUser =
        await User.findOne({
            $or: [
                {
                    email,
                },
                {
                    phone,
                },
            ],
        });

    if (existingUser) {
        const duplicateField =
            existingUser.email === email
                ? "email"
                : "phone";

        const error =
            new Error(
                `A user with this ${duplicateField} already exists`
            );

        error.statusCode = 409;
        error.code =
            "DUPLICATE_USER";

        throw error;
    }

    if (payload.zoneId) {
        const zone =
            await Zone.findById(
                payload.zoneId
            );

        if (!zone) {
            throw new Error(
                "Zone not found"
            );
        }

        if (!zone.isActive) {
            throw new Error(
                "Cannot assign agent to an inactive zone"
            );
        }
    }

    const passwordHash =
        await bcrypt.hash(
            payload.password,
            12
        );

    let user;

    try {
        user =
            await User.create({
                name:
                    payload.name.trim(),

                email,

                phone,

                passwordHash,

                role:
                    "DELIVERY_AGENT",

                isActive: true,
            });

        const profile =
            await AgentProfile.create({
                userId:
                    user._id,

                availability:
                    payload.availability ||
                    "OFFLINE",

                currentZoneId:
                    payload.zoneId ||
                    null,

                activeOrderCount:
                    0,
            });

        return {
            user: {
                _id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role,

                isActive:
                    user.isActive,
            },

            profile,
        };
    } catch (error) {
        if (user?._id) {
            await User.findByIdAndDelete(
                user._id
            );
        }

        /*
         * Handle MongoDB unique-index
         * violations as conflicts too.
         */
        if (error.code === 11000) {
            const duplicateField =
                Object.keys(
                    error.keyPattern ||
                    {}
                )[0] || "email or phone";

            const duplicateError =
                new Error(
                    `A user with this ${duplicateField} already exists`
                );

            duplicateError.statusCode =
                409;

            duplicateError.code =
                "DUPLICATE_USER";

            throw duplicateError;
        }

        throw error;
    }
};

const updateAgent = async (
    agentId,
    payload
) => {
    if (
        !mongoose.Types.ObjectId.isValid(
            agentId
        )
    ) {
        throw new Error(
            "Invalid agent ID"
        );
    }

    const agent =
        await User.findOne({
            _id: agentId,
            role: "DELIVERY_AGENT",
        });

    if (!agent) {
        throw new Error(
            "Delivery agent not found"
        );
    }

    if (payload.zoneId) {
        const zone =
            await Zone.findById(
                payload.zoneId
            );

        if (!zone) {
            throw new Error(
                "Zone not found"
            );
        }

        if (!zone.isActive) {
            throw new Error(
                "Cannot assign agent to an inactive zone"
            );
        }
    }

    const userUpdates = {};

    if (payload.name !== undefined) {
        userUpdates.name =
            payload.name;
    }

    if (payload.phone !== undefined) {
        userUpdates.phone =
            payload.phone;
    }

    if (
        payload.isActive !==
        undefined
    ) {
        userUpdates.isActive =
            payload.isActive;
    }

    if (
        Object.keys(userUpdates)
            .length > 0
    ) {
        await User.findByIdAndUpdate(
            agentId,
            userUpdates,
            {
                new: true,
                runValidators: true,
            }
        );
    }

    const profileUpdates = {};

    if (
        payload.zoneId !==
        undefined
    ) {
        profileUpdates.currentZoneId =
            payload.zoneId;
    }

    if (
        payload.availability !==
        undefined
    ) {
        profileUpdates.availability =
            payload.availability;
    }

    const profile =
        await AgentProfile.findOneAndUpdate(
            {
                userId: agentId,
            },
            profileUpdates,
            {
                new: true,
                runValidators: true,
            }
        );

    if (!profile) {
        throw new Error(
            "Agent profile not found"
        );
    }

    return AgentProfile.findOne({
        userId: agentId,
    })
        .populate(
            "userId",
            "name email phone role isActive"
        )
        .populate(
            "currentZoneId",
            "name code"
        );
};

const updateAgentAssignmentCounts =
    async ({
        previousAgentId,
        nextAgentId,
    }) => {
        if (
            previousAgentId &&
            previousAgentId.toString() !==
            nextAgentId.toString()
        ) {
            const previousProfile =
                await AgentProfile.findOne({
                    userId:
                        previousAgentId,
                });

            if (previousProfile) {
                previousProfile.activeOrderCount =
                    Math.max(
                        0,
                        previousProfile.activeOrderCount -
                        1
                    );

                if (
                    previousProfile.activeOrderCount ===
                    0 &&
                    previousProfile.availability ===
                    "BUSY"
                ) {
                    previousProfile.availability =
                        "AVAILABLE";
                }

                await previousProfile.save();
            }
        }

        if (
            !previousAgentId ||
            previousAgentId.toString() !==
            nextAgentId.toString()
        ) {
            const nextProfile =
                await AgentProfile.findOne({
                    userId:
                        nextAgentId,
                });

            if (!nextProfile) {
                throw new Error(
                    "Agent profile not found"
                );
            }

            nextProfile.activeOrderCount +=
                1;

            nextProfile.availability =
                "BUSY";

            await nextProfile.save();
        }
    };

module.exports = {
    getDashboard,
    getOrders,

    getAgents,

    getZones,
    createZone,
    updateZone,

    getAreas,
    createArea,
    updateArea,

    getRateCards,
    createRateCard,
    updateRateCard,

    overrideOrderStatus,

    assignAgent,
    calculateDistance,
    autoAssignAgent,

    createAgent,
    updateAgent,
    updateAgentAssignmentCounts,
};