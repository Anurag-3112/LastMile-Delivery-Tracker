const RateCard = require("../../models/RateCard");

const validateSlabs = (slabs) => {
    if (!Array.isArray(slabs) || slabs.length === 0) {
        const error = new Error(
            "At least one weight slab is required"
        );

        error.statusCode = 400;
        error.code = "INVALID_WEIGHT_SLABS";

        throw error;
    }

    const sortedSlabs = [...slabs].sort(
        (a, b) =>
            a.minWeight - b.minWeight
    );

    for (
        let i = 0;
        i < sortedSlabs.length;
        i++
    ) {
        const slab = sortedSlabs[i];

        if (
            slab.maxWeight <=
            slab.minWeight
        ) {
            const error = new Error(
                "Maximum weight must be greater than minimum weight"
            );

            error.statusCode = 400;
            error.code =
                "INVALID_WEIGHT_SLAB";

            throw error;
        }

        if (i > 0) {
            const previous =
                sortedSlabs[i - 1];

            if (
                slab.minWeight <
                previous.maxWeight
            ) {
                const error = new Error(
                    "Weight slabs cannot overlap"
                );

                error.statusCode = 400;
                error.code =
                    "OVERLAPPING_WEIGHT_SLABS";

                throw error;
            }
        }
    }

    return sortedSlabs;
};

const createRateCard = async ({
    orderType,
    zoneType,
    slabs,
    codSurcharge,
    isActive = true,
}) => {
    const validatedSlabs =
        validateSlabs(slabs);

    const existing =
        await RateCard.findOne({
            orderType,
            zoneType,
            isActive: true,
        });

    if (existing && isActive) {
        const error = new Error(
            `An active ${orderType} ${zoneType} rate card already exists`
        );

        error.statusCode = 409;
        error.code =
            "ACTIVE_RATE_CARD_EXISTS";

        throw error;
    }

    return RateCard.create({
        orderType,
        zoneType,
        slabs: validatedSlabs,
        codSurcharge,
        isActive,
    });
};

const getRateCards = async () => {
    return RateCard.find()
        .sort({
            orderType: 1,
            zoneType: 1,
        })
        .lean();
};

const updateRateCard = async (
    rateCardId,
    updates
) => {
    const rateCard =
        await RateCard.findById(
            rateCardId
        );

    if (!rateCard) {
        const error = new Error(
            "Rate card not found"
        );

        error.statusCode = 404;
        error.code =
            "RATE_CARD_NOT_FOUND";

        throw error;
    }

    if (updates.slabs) {
        updates.slabs =
            validateSlabs(
                updates.slabs
            );
    }

    const nextOrderType =
        updates.orderType ??
        rateCard.orderType;

    const nextZoneType =
        updates.zoneType ??
        rateCard.zoneType;

    const nextIsActive =
        updates.isActive ??
        rateCard.isActive;

    if (nextIsActive) {
        const existing =
            await RateCard.findOne({
                _id: {
                    $ne: rateCardId,
                },

                orderType:
                    nextOrderType,

                zoneType:
                    nextZoneType,

                isActive: true,
            });

        if (existing) {
            const error = new Error(
                `An active ${nextOrderType} ${nextZoneType} rate card already exists`
            );

            error.statusCode = 409;
            error.code =
                "ACTIVE_RATE_CARD_EXISTS";

            throw error;
        }
    }

    Object.assign(
        rateCard,
        updates
    );

    return rateCard.save();
};

module.exports = {
    createRateCard,
    updateRateCard,
    getRateCards,
    validateSlabs,
};