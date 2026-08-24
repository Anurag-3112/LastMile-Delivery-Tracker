const express = require("express");

const controller =
    require("./area.controller");

const validate =
    require("../../middleware/validate");

const {
    requireAuth,
    requireRole,
} = require("../../middleware/auth");

const {
    createAreaSchema,
} = require("./area.validation");

const router =
    express.Router();

/*
 * Get all areas
 */
router.get(
    "/",
    requireAuth,
    controller.getAreas
);

/*
 * Create area
 */
router.post(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    validate(createAreaSchema),
    controller.createArea
);

module.exports = router;