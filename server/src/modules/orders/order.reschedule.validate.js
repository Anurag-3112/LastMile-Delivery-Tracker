const { z } = require("zod");

const rescheduleSchema =
    z.object({
        newDeliveryDate:
            z.string().datetime(),

        reason:
            z.string()
                .trim()
                .max(500)
                .optional(),
    })
        .superRefine(
            (data, ctx) => {
                if (
                    new Date(
                        data.newDeliveryDate
                    ) <= new Date()
                ) {
                    ctx.addIssue({
                        code:
                            z.ZodIssueCode
                                .custom,

                        path: [
                            "newDeliveryDate",
                        ],

                        message:
                            "New delivery date must be in the future",
                    });
                }
            }
        );

module.exports = {
    rescheduleSchema,
};