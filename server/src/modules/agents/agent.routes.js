const express = require("express");

const controller =
    require("./agent.controller");

const validate =
    require("../../middleware/validate");

const {
    requireAuth,
    requireRole,
} = require("../../middleware/auth");

const {
    updateAvailabilitySchema,
    updateLocationSchema,
} = require("./agent.validation");

const router =
    express.Router();

/*
 * Agent profile
 */
router.get(
    "/profile",
    requireAuth,
    requireRole("DELIVERY_AGENT"),
    controller.getProfile
);

/*
 * Assigned orders
 */
router.get(
    "/orders",
    requireAuth,
    requireRole("DELIVERY_AGENT"),
    controller.getAssignedOrders
);

/*
 * Update availability
 */
router.patch(
    "/availability",
    requireAuth,
    requireRole("DELIVERY_AGENT"),
    validate(updateAvailabilitySchema),
    controller.updateAvailability
);

/*
 * Update location
 */
router.patch(
    "/location",
    requireAuth,
    requireRole("DELIVERY_AGENT"),
    validate(updateLocationSchema),
    controller.updateLocation
);

module.exports = router;