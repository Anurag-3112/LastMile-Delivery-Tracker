const express = require("express");

const controller =
    require("./zone.controller");

const validate =
    require("../../middleware/validate");

const {
    requireAuth,
    requireRole,
} = require("../../middleware/auth");

const {
    createZoneSchema,
} = require("./zone.validation");

const router =
    express.Router();

/*
 * Get all zones
 */
router.get(
    "/",
    requireAuth,
    controller.getZones
);

/*
 * Create zone
 */
router.post(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    validate(createZoneSchema),
    controller.createZone
);

module.exports = router;