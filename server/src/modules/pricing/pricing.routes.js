const express = require("express");

const controller =
    require("./pricing.controller");

const validate =
    require("../../middleware/validate");

const {
    requireAuth,
    requireRole,
} = require("../../middleware/auth");

const {
    createRateCardSchema,
    quoteSchema,
} = require("./pricing.validation");

const router =
    express.Router();

/*
 * Get pricing quote
 */
router.post(
    "/quote",
    requireAuth,
    validate(quoteSchema),
    controller.getQuote
);

/*
 * Get rate cards
 * Admin only
 */
router.get(
    "/rate-cards",
    requireAuth,
    requireRole("ADMIN"),
    controller.getRateCards
);

/*
 * Create rate card
 * Admin only
 */
router.post(
    "/rate-cards",
    requireAuth,
    requireRole("ADMIN"),
    validate(createRateCardSchema),
    controller.createRateCard
);

module.exports = router;