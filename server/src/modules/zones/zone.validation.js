const { z } = require("zod");

const createZoneSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(100),

    code: z
        .string()
        .trim()
        .min(2)
        .max(20)
        .regex(/^[a-zA-Z0-9_-]+$/),

    description: z
        .string()
        .trim()
        .max(500)
        .optional(),
});

module.exports = {
    createZoneSchema,
};