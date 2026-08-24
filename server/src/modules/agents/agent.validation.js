const { z } = require("zod");

const updateAvailabilitySchema = z.object({
    availability: z.enum([
        "AVAILABLE",
        "BUSY",
        "OFFLINE",
    ]),
});

const updateLocationSchema = z.object({
    latitude: z
        .number()
        .min(-90)
        .max(90),

    longitude: z
        .number()
        .min(-180)
        .max(180),

    zoneId: z
        .string()
        .min(1),
});

module.exports = {
    updateAvailabilitySchema,
    updateLocationSchema,
};