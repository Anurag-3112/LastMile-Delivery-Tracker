const express = require("express");

const controller =
    require("./area.controller");

const {
    requireAuth,
} = require("../../middleware/auth");

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

module.exports = router;