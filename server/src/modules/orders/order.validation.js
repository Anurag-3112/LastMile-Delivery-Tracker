const { z } = require("zod");

const locationSchema = z.object({
    address: z
        .string()
        .trim()
        .min(5),

    areaId: z
        .string()
        .min(1),

    latitude: z
        .number()
        .min(-90)
        .max(90)
        .optional(),

    longitude: z
        .number()
        .min(-180)
        .max(180)
        .optional(),
});

const packageSchema = z.object({
    length: z.number().positive(),
    breadth: z.number().positive(),
    height: z.number().positive(),
    actualWeight: z.number().positive(),
});

const createOrderSchema = z.object({
    pickup: locationSchema,

    drop: locationSchema,

    package: packageSchema,

    orderType: z.enum([
        "B2B",
        "B2C",
    ]),

    paymentType: z.enum([
        "PREPAID",
        "COD",
    ]),
});

module.exports = {
    createOrderSchema,
};