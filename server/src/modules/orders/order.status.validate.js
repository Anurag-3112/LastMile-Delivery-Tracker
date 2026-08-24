const { z } = require("zod");

const updateStatusSchema =
    z.object({
        status: z.enum([
            "PICKED_UP",
            "IN_TRANSIT",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "FAILED",
        ]),

        reason: z
            .string()
            .trim()
            .max(500)
            .optional(),
    }).superRefine(
        (data, ctx) => {
            if (
                data.status ===
                "FAILED" &&
                !data.reason
            ) {
                ctx.addIssue({
                    code:
                        z.ZodIssueCode
                            .custom,

                    path: [
                        "reason",
                    ],

                    message:
                        "Failure reason is required",
                });
            }
        }
    );

module.exports = {
    updateStatusSchema,
};