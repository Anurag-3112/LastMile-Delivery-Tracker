const { z } = require("zod");

const ORDER_STATUSES = [
    "CREATED",
    "ASSIGNED",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "FAILED",
];

/*
 * ========================================
 * ZONE
 * ========================================
 */

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
        .transform((value) =>
            value.toUpperCase()
        ),

    description: z
        .string()
        .trim()
        .max(500)
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});

const updateZoneSchema =
    createZoneSchema.partial();

/*
 * ========================================
 * AREA
 * ========================================
 */

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
        .transform((value) =>
            value.toUpperCase()
        ),

    pincode: z
        .string()
        .regex(
            /^[0-9]{6}$/,
            "Pincode must contain exactly 6 digits"
        ),

    zoneId: z
        .string()
        .min(1),

    isActive: z
        .boolean()
        .optional(),
});

const updateAreaSchema =
    createAreaSchema.partial();

/*
 * ========================================
 * RATE CARD
 * ========================================
 */

const weightSlabSchema = z.object({
    minWeight: z
        .number()
        .finite()
        .nonnegative(),

    maxWeight: z
        .number()
        .finite()
        .positive(),

    rate: z
        .number()
        .finite()
        .nonnegative(),
});

/*
 * Validate the complete slabs array.
 *
 * Rules:
 *
 * 1. maxWeight > minWeight
 * 2. slabs cannot overlap
 *
 * Adjacent slabs are allowed:
 *
 * 0 -> 2
 * 2 -> 5
 * 5 -> 10
 *
 * Overlapping slabs are rejected:
 *
 * 0 -> 5
 * 2 -> 8
 */
const validateWeightSlabs = (
    slabs,
    ctx,
    pathPrefix = ["slabs"]
) => {
    if (
        !Array.isArray(slabs) ||
        slabs.length === 0
    ) {
        return;
    }

    const sortedSlabs = [
        ...slabs,
    ].sort(
        (a, b) =>
            a.minWeight -
            b.minWeight
    );

    for (
        let i = 0;
        i < sortedSlabs.length;
        i++
    ) {
        const slab =
            sortedSlabs[i];

        /*
         * maxWeight must be greater
         * than minWeight.
         */
        if (
            slab.maxWeight <=
            slab.minWeight
        ) {
            ctx.addIssue({
                code: "custom",

                path: [
                    ...pathPrefix,
                    i,
                    "maxWeight",
                ],

                message:
                    "maxWeight must be greater than minWeight",
            });
        }

        /*
         * Check overlap.
         */
        if (i > 0) {
            const previous =
                sortedSlabs[i - 1];

            if (
                slab.minWeight <
                previous.maxWeight
            ) {
                ctx.addIssue({
                    code: "custom",

                    path: [
                        ...pathPrefix,
                        i,
                        "minWeight",
                    ],

                    message:
                        "Weight slabs must not overlap",
                });
            }
        }
    }
};

/*
 * CREATE RATE CARD
 */

const createRateCardSchema =
    z
        .object({
            orderType: z.enum([
                "B2B",
                "B2C",
            ]),

            zoneType: z.enum([
                "INTRA",
                "INTER",
            ]),

            slabs: z
                .array(weightSlabSchema)
                .min(
                    1,
                    "At least one weight slab is required"
                ),

            codSurcharge: z
                .number()
                .finite()
                .nonnegative(),

            isActive: z
                .boolean()
                .optional()
                .default(true),
        })
        .superRefine(
            (payload, ctx) => {
                validateWeightSlabs(
                    payload.slabs,
                    ctx,
                    ["slabs"]
                );
            }
        );

/*
 * UPDATE RATE CARD
 */

const updateRateCardSchema =
    z
        .object({
            orderType: z
                .enum([
                    "B2B",
                    "B2C",
                ])
                .optional(),

            zoneType: z
                .enum([
                    "INTRA",
                    "INTER",
                ])
                .optional(),

            slabs: z
                .array(weightSlabSchema)
                .min(
                    1,
                    "At least one weight slab is required"
                )
                .optional(),

            codSurcharge: z
                .number()
                .finite()
                .nonnegative()
                .optional(),

            isActive: z
                .boolean()
                .optional(),
        })
        .superRefine(
            (payload, ctx) => {
                if (
                    payload.slabs
                ) {
                    validateWeightSlabs(
                        payload.slabs,
                        ctx,
                        ["slabs"]
                    );
                }
            }
        );

/*
 * ========================================
 * ORDER STATUS
 * ========================================
 */

const overrideOrderStatusSchema =
    z.object({
        status: z.enum(
            ORDER_STATUSES
        ),

        reason: z
            .string()
            .trim()
            .min(3)
            .max(500),
    });

/*
 * ========================================
 * AGENT ASSIGNMENT
 * ========================================
 */

const assignAgentSchema =
    z.object({
        agentId: z
            .string()
            .min(1),
    });

/*
 * ========================================
 * CREATE AGENT
 * ========================================
 */

const createAgentSchema =
    z.object({
        name: z
            .string()
            .trim()
            .min(2)
            .max(100),

        email: z
            .string()
            .trim()
            .email()
            .transform((value) =>
                value.toLowerCase()
            ),

        phone: z
            .string()
            .regex(
                /^[0-9]{10}$/,
                "Phone must contain exactly 10 digits"
            ),

        password: z
            .string()
            .min(8)
            .max(128),

        zoneId: z
            .string()
            .optional(),

        availability: z
            .enum([
                "AVAILABLE",
                "OFFLINE",
            ])
            .optional()
            .default(
                "OFFLINE"
            ),
    });

/*
 * ========================================
 * UPDATE AGENT
 * ========================================
 */

const updateAgentSchema =
    z.object({
        name: z
            .string()
            .trim()
            .min(2)
            .max(100)
            .optional(),

        phone: z
            .string()
            .regex(
                /^[0-9]{10}$/,
                "Phone must contain exactly 10 digits"
            )
            .optional(),

        zoneId: z
            .string()
            .optional(),

        availability: z
            .enum([
                "AVAILABLE",
                "BUSY",
                "OFFLINE",
            ])
            .optional(),

        isActive: z
            .boolean()
            .optional(),
    });

module.exports = {
    ORDER_STATUSES,

    createZoneSchema,
    updateZoneSchema,

    createAreaSchema,
    updateAreaSchema,

    createRateCardSchema,
    updateRateCardSchema,

    overrideOrderStatusSchema,
    assignAgentSchema,

    createAgentSchema,
    updateAgentSchema,
};