const { z } = require("zod");

const manualAssignmentSchema =
    z.object({
        agentId: z
            .string()
            .min(1),
    });

module.exports = {
    manualAssignmentSchema,
};