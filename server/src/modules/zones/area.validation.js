const { z } = require("zod");

const createAreaSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(100),

    code: z
        .string()
        .trim()
        .min(2)
        .max(30)
        .regex(/^[a-zA-Z0-9_-]+$/),

    pincode: z
        .string()
        .regex(/^[0-9]{6}$/),

    zoneId: z
        .string()
        .min(1),
});

module.exports = {
    createAreaSchema,
};