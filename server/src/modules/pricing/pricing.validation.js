const { z } = require("zod");

const weightSlabSchema = z.object({
    minWeight: z.number().min(0),
    maxWeight: z.number().positive(),
    rate: z.number().min(0),
});

const createRateCardSchema = z.object({
    orderType: z.enum(["B2B", "B2C"]),

    zoneType: z.enum(["INTRA", "INTER"]),

    slabs: z
        .array(weightSlabSchema)
        .min(1),

    codSurcharge: z
        .number()
        .min(0),
});

const quoteSchema = z.object({
    pickupAreaId: z.string().min(1),

    dropAreaId: z.string().min(1),

    length: z.number().positive(),

    breadth: z.number().positive(),

    height: z.number().positive(),

    actualWeight: z.number().positive(),

    orderType: z.enum(["B2B", "B2C"]),

    paymentType: z.enum(["PREPAID", "COD"]),
});

module.exports = {
    createRateCardSchema,
    quoteSchema,
};