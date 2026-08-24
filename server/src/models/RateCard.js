const mongoose = require("mongoose");

const weightSlabSchema = new mongoose.Schema(
    {
        minWeight: {
            type: Number,
            required: true,
            min: 0,
        },

        maxWeight: {
            type: Number,
            required: true,
            min: 0,
        },

        rate: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const rateCardSchema = new mongoose.Schema(
    {
        orderType: {
            type: String,
            enum: ["B2B", "B2C"],
            required: true,
            trim: true,
        },

        zoneType: {
            type: String,
            enum: ["INTRA", "INTER"],
            required: true,
            trim: true,
        },

        slabs: {
            type: [weightSlabSchema],
            required: true,

            validate: {
                validator: function (slabs) {
                    if (
                        !Array.isArray(slabs) ||
                        slabs.length === 0
                    ) {
                        return false;
                    }

                    const sorted = [
                        ...slabs,
                    ].sort(
                        (a, b) =>
                            a.minWeight -
                            b.minWeight
                    );

                    for (
                        let i = 0;
                        i < sorted.length;
                        i++
                    ) {
                        const slab =
                            sorted[i];

                        if (
                            slab.maxWeight <=
                            slab.minWeight
                        ) {
                            return false;
                        }

                        if (i > 0) {
                            const previous =
                                sorted[
                                i - 1
                                ];

                            /*
                             * Prevent overlapping slabs.
                             *
                             * Example:
                             * 0-5
                             * 4-10
                             *
                             * is invalid.
                             */
                            if (
                                slab.minWeight <
                                previous.maxWeight
                            ) {
                                return false;
                            }
                        }
                    }

                    return true;
                },

                message:
                    "Rate slabs must contain valid, non-overlapping weight ranges",
            },
        },

        codSurcharge: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

/*
 * Only one ACTIVE rate card is allowed
 * for each orderType + zoneType combination.
 *
 * This still allows old/inactive rate cards
 * to remain in the database.
 */
rateCardSchema.index(
    {
        orderType: 1,
        zoneType: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            isActive: true,
        },
    }
);

module.exports =
    mongoose.model(
        "RateCard",
        rateCardSchema
    );