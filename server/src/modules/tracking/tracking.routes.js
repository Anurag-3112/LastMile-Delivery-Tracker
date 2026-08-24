const express =
    require("express");

const trackingController =
    require("./tracking.controller");

const {
    requireAuth,
    requireRole,
} = require("../../middleware/auth");

const router =
    express.Router();

router.get(
    "/orders/:orderId/tracking",
    requireAuth,
    requireRole(
        "CUSTOMER",
        "DELIVERY_AGENT",
        "ADMIN"
    ),
    trackingController.getTracking
);

module.exports = router;