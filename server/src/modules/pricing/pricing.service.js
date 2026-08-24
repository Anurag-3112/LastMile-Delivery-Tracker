const Area =
    require("../../models/Area");

const RateCard =
    require("../../models/RateCard");

const {
    calculateVolumetricWeight,
    calculateBillableWeight,
} = require("./pricing.calculator");

const {
    determineZoneType,
} = require("./pricing.zone");

/*
 * ----------------------------------------
 * FIND RATE CARD
 * ----------------------------------------
 */

const findRateCard = async ({
    orderType,
    zoneType,
}) => {
    const normalizedOrderType =
        String(orderType || "")
            .trim()
            .toUpperCase();

    const normalizedZoneType =
        String(zoneType || "")
            .trim()
            .toUpperCase()
            .replace(/_ZONE$/, "");

    const rateCard =
        await RateCard.findOne({
            orderType:
                normalizedOrderType,

            zoneType:
                normalizedZoneType,

            isActive: true,
        });

    if (!rateCard) {
        const error = new Error(
            `No active rate card configured for ${normalizedOrderType} ${normalizedZoneType}`
        );

        error.statusCode = 400;
        error.code =
            "RATE_CARD_NOT_FOUND";

        throw error;
    }

    return rateCard;
};

/*
 * ----------------------------------------
 * FIND RATE FOR WEIGHT
 * ----------------------------------------
 */

const findRateForWeight = ({
    slabs,
    billableWeight,
}) => {
    if (
        !Array.isArray(slabs) ||
        slabs.length === 0
    ) {
        const error = new Error(
            "No weight slabs configured for rate card"
        );

        error.statusCode = 400;
        error.code =
            "NO_WEIGHT_SLABS";

        throw error;
    }

    const sortedSlabs =
        [...slabs].sort(
            (a, b) =>
                a.minWeight -
                b.minWeight
        );

    const slab =
        sortedSlabs.find(
            (
                currentSlab,
                index
            ) => {
                const isLastSlab =
                    index ===
                    sortedSlabs.length -
                    1;

                if (isLastSlab) {
                    return (
                        billableWeight >=
                        currentSlab.minWeight &&
                        billableWeight <=
                        currentSlab.maxWeight
                    );
                }

                return (
                    billableWeight >=
                    currentSlab.minWeight &&
                    billableWeight <
                    currentSlab.maxWeight
                );
            }
        );

    if (!slab) {
        const error = new Error(
            `No rate slab found for billable weight ${billableWeight} kg`
        );

        error.statusCode = 400;
        error.code =
            "NO_RATE_SLAB";

        throw error;
    }

    return slab.rate;
};

/*
 * ----------------------------------------
 * RESOLVE PICKUP / DROP ZONES
 * ----------------------------------------
 */

const resolveZones = async ({
    pickupAreaId,
    dropAreaId,
}) => {
    const areas =
        await Area.find({
            _id: {
                $in: [
                    pickupAreaId,
                    dropAreaId,
                ],
            },

            isActive: true,
        }).populate(
            "zoneId"
        );

    const pickupArea =
        areas.find(
            (area) =>
                area._id.toString() ===
                pickupAreaId.toString()
        );

    const dropArea =
        areas.find(
            (area) =>
                area._id.toString() ===
                dropAreaId.toString()
        );

    if (!pickupArea) {
        const error = new Error(
            "Pickup area not found"
        );

        error.statusCode = 404;
        error.code =
            "PICKUP_AREA_NOT_FOUND";

        throw error;
    }

    if (!dropArea) {
        const error = new Error(
            "Drop area not found"
        );

        error.statusCode = 404;
        error.code =
            "DROP_AREA_NOT_FOUND";

        throw error;
    }

    if (!pickupArea.zoneId) {
        const error = new Error(
            "Pickup area is not assigned to a zone"
        );

        error.statusCode = 400;
        error.code =
            "PICKUP_ZONE_NOT_FOUND";

        throw error;
    }

    if (!dropArea.zoneId) {
        const error = new Error(
            "Drop area is not assigned to a zone"
        );

        error.statusCode = 400;
        error.code =
            "DROP_ZONE_NOT_FOUND";

        throw error;
    }

    return {
        pickupArea,
        dropArea,

        pickupZone:
            pickupArea.zoneId,

        dropZone:
            dropArea.zoneId,
    };
};

/*
 * ----------------------------------------
 * CALCULATE QUOTE
 * ----------------------------------------
 */

const calculateQuote = async ({
    pickupAreaId,
    dropAreaId,

    length,
    breadth,
    height,

    actualWeight,

    orderType,
    paymentType,
}) => {
    /*
     * Resolve areas and zones
     */

    const {
        pickupZone,
        dropZone,
    } = await resolveZones({
        pickupAreaId,
        dropAreaId,
    });

    /*
     * Determine INTRA / INTER
     */

    const zoneType =
        determineZoneType({
            pickupZoneId:
                pickupZone._id,

            dropZoneId:
                dropZone._id,
        });

    console.log(
        "Pricing zone calculation:",
        {
            pickupZone:
                pickupZone.code,

            dropZone:
                dropZone.code,

            pickupZoneId:
                pickupZone._id.toString(),

            dropZoneId:
                dropZone._id.toString(),

            zoneType,
        }
    );

    /*
     * Calculate volumetric weight
     */

    const volumetricWeight =
        calculateVolumetricWeight({
            length,
            breadth,
            height,
        });

    /*
     * Calculate billable weight
     */

    const billableWeight =
        calculateBillableWeight({
            actualWeight,
            volumetricWeight,
        });

    /*
     * Find active rate card
     */

    const rateCard =
        await findRateCard({
            orderType,
            zoneType,
        });

    /*
     * Find applicable weight slab
     */

    const ratePerKg =
        findRateForWeight({
            slabs:
                rateCard.slabs,

            billableWeight,
        });

    /*
     * Calculate base charge
     */

    const baseCharge =
        ratePerKg *
        billableWeight;

    /*
     * COD surcharge
     */

    const codSurcharge =
        paymentType === "COD"
            ? rateCard.codSurcharge
            : 0;

    /*
     * Total
     */

    const totalCharge =
        baseCharge +
        codSurcharge;

    return {
        pickupZone: {
            id:
                pickupZone._id,

            name:
                pickupZone.name,

            code:
                pickupZone.code,
        },

        dropZone: {
            id:
                dropZone._id,

            name:
                dropZone.name,

            code:
                dropZone.code,
        },

        zoneType,

        actualWeight,

        volumetricWeight,

        billableWeight,

        ratePerKg,

        baseCharge,

        codSurcharge,

        totalCharge,

        currency: "INR",

        rateCardId:
            rateCard._id,
    };
};

module.exports = {
    calculateVolumetricWeight,
    calculateBillableWeight,

    findRateForWeight,

    resolveZones,

    determineZoneType,

    findRateCard,

    calculateQuote,
};