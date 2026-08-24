const express = require("express");

const adminController =
    require("./admin.controller");

const {
    requireAuth,
    requireRole,
} = require("../../middleware/auth");

const router =
    express.Router();

router.use(
    requireAuth,
    requireRole("ADMIN")
);

/*
 * Dashboard
 */

router.get(
    "/dashboard",
    adminController.getDashboard
);

/*
 * Orders
 */

router.get(
    "/orders",
    adminController.getOrders
);

router.patch(
    "/orders/:orderId/status",
    adminController.overrideOrderStatus
);

router.patch(
    "/orders/:orderId/assign",
    adminController.assignAgent
);

router.post(
    "/orders/:orderId/auto-assign",
    adminController.autoAssignAgent
);

/*
 * Agents
 */

router.get(
    "/agents",
    adminController.getAgents
);

router.post(
    "/agents",
    adminController.createAgent
);

router.patch(
    "/agents/:agentId",
    adminController.updateAgent
);

/*
 * Zones
 */

router.get(
    "/zones",
    adminController.getZones
);

router.post(
    "/zones",
    adminController.createZone
);

router.patch(
    "/zones/:zoneId",
    adminController.updateZone
);

/*
 * Areas
 */

router.get(
    "/areas",
    adminController.getAreas
);

router.post(
    "/areas",
    adminController.createArea
);

router.patch(
    "/areas/:areaId",
    adminController.updateArea
);

/*
 * Rate Cards
 */

router.get(
    "/rate-cards",
    adminController.getRateCards
);

router.post(
    "/rate-cards",
    adminController.createRateCard
);

router.patch(
    "/rate-cards/:rateCardId",
    adminController.updateRateCard
);

module.exports = router;