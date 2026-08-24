const express =
    require("express");

const controller =
    require("./order.controller");

const agentController =
    require("./order.agent.controller");

const {
    createOrderSchema,
} = require("./order.validation");

const {
    updateStatusSchema,
} = require("./order.status.validate");

const validate =
    require("../../middleware/validate");

const {
    requireAuth,
    requireRole,
} = require("../../middleware/auth");

const rescheduleController =
    require("./order.reschedule.controller");

const {
    rescheduleSchema,
} = require("./order.reschedule.validate");

const router =
    express.Router();

/*
 * Create order
 * Customer only
 */
router.post(
    "/",
    requireAuth,
    requireRole("CUSTOMER"),
    validate(createOrderSchema),
    controller.createOrder
);

/*
 * Get customer orders
 * Customer only
 */
router.get(
    "/",
    requireAuth,
    requireRole("CUSTOMER"),
    controller.getCustomerOrders
);

/*
 * Get my orders
 * Customer only
 */
router.get(
    "/my",
    requireAuth,
    requireRole("CUSTOMER"),
    controller.getCustomerOrders
);

/*
 * Get order by ID
 * Authenticated users
 */
router.get(
    "/:orderId",
    requireAuth,
    controller.getOrder
);

/*
 * Update order status
 * Delivery agent only
 */
router.patch(
    "/:orderId/status",
    requireAuth,
    requireRole("DELIVERY_AGENT"),
    validate(updateStatusSchema),
    agentController.updateStatus
);

/*
 * Reschedule order
 * Customer only
 */
router.post(
    "/:orderId/reschedule",
    requireAuth,
    requireRole("CUSTOMER"),
    validate(rescheduleSchema),
    rescheduleController.rescheduleOrder
);

module.exports = router;