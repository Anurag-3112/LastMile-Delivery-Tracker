const express =
    require("express");

const controller =
    require("./assignment.controller");

const {
    requireAuth,
    requireRole,
} = require("../../middleware/auth");

const validate =
    require("../../middleware/validate");

const {
    manualAssignmentSchema,
} = require("./assignment.validation");

const router =
    express.Router();

/*
 * Automatically assign an order
 * Admin only
 */
router.post(
    "/orders/:orderId/auto-assign",
    requireAuth,
    requireRole("ADMIN"),
    controller.autoAssign
);

/*
 * Manually assign an order
 * Admin only
 */
router.post(
    "/orders/:orderId/assign",
    requireAuth,
    requireRole("ADMIN"),
    validate(manualAssignmentSchema),
    controller.manualAssign
);

module.exports = router;