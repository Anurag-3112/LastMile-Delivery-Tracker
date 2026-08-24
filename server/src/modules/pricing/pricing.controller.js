const rateCardService = require("./rateCard.service");

const createRateCard = async (req, res, next) => {
    try {
        const rateCard = await rateCardService.createRateCard(
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Rate card created successfully",
            data: {
                rateCard,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getRateCards = async (req, res, next) => {
    try {
        const rateCards =
            await rateCardService.getRateCards();

        res.status(200).json({
            success: true,
            data: {
                rateCards,
            },
        });
    } catch (error) {
        next(error);
    }
};

const pricingService = require("./pricing.service");

const getQuote = async (req, res, next) => {
    try {
        const quote =
            await pricingService.calculateQuote(
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Pricing calculated successfully",
            data: {
                quote,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRateCard,
    getRateCards,
    getQuote,
};
