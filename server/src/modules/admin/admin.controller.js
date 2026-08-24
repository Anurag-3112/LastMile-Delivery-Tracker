const adminService =
    require("./admin.service");

const {
    createZoneSchema,
    updateZoneSchema,
    createAreaSchema,
    updateAreaSchema,
    createRateCardSchema,
    updateRateCardSchema,
    overrideOrderStatusSchema,
    assignAgentSchema,
    createAgentSchema,
    updateAgentSchema,
} = require("./admin.validation");

const getDashboard =
    async (req, res, next) => {
        try {
            const result =
                await adminService
                    .getDashboard();

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const getOrders =
    async (req, res, next) => {
        try {
            const result =
                await adminService
                    .getOrders(req.query);

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const overrideOrderStatus =
    async (req, res, next) => {
        try {
            const payload =
                overrideOrderStatusSchema.parse(
                    req.body
                );

            const result =
                await adminService
                    .overrideOrderStatus(
                        req.params.orderId,
                        payload,
                        req.user
                    );

            return res.status(200).json({
                success: true,
                message:
                    "Order status overridden successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const assignAgent =
    async (req, res, next) => {
        try {
            const payload =
                assignAgentSchema.parse(
                    req.body
                );

            const order =
                await adminService.assignAgent(
                    req.params.orderId,
                    payload.agentId,
                    req.user
                );

            return res.status(200).json({
                success: true,
                message:
                    "Agent assigned successfully",
                data: {
                    order,
                },
            });
        } catch (error) {
            next(error);
        }
    };

const autoAssignAgent =
    async (req, res, next) => {
        try {
            const order =
                await adminService.autoAssignAgent(
                    req.params.orderId,
                    req.user
                );

            return res.status(200).json({
                success: true,
                message:
                    "Agent assigned automatically",
                data: {
                    order,
                },
            });
        } catch (error) {
            next(error);
        }
    };

const getAgents =
    async (req, res, next) => {
        try {
            const result =
                await adminService
                    .getAgents();

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const getZones =
    async (req, res, next) => {
        try {
            const result =
                await adminService
                    .getZones();

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const createZone =
    async (req, res, next) => {
        try {
            const payload =
                createZoneSchema.parse(
                    req.body
                );

            const result =
                await adminService
                    .createZone(payload);

            return res.status(201).json({
                success: true,
                message:
                    "Zone created successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const updateZone =
    async (req, res, next) => {
        try {
            const payload =
                updateZoneSchema.parse(
                    req.body
                );

            const result =
                await adminService
                    .updateZone(
                        req.params.zoneId,
                        payload
                    );

            return res.status(200).json({
                success: true,
                message:
                    "Zone updated successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const getAreas =
    async (req, res, next) => {
        try {
            const result =
                await adminService
                    .getAreas();

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const createArea =
    async (req, res, next) => {
        try {
            const payload =
                createAreaSchema.parse(
                    req.body
                );

            const result =
                await adminService
                    .createArea(payload);

            return res.status(201).json({
                success: true,
                message:
                    "Area created successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const updateArea =
    async (req, res, next) => {
        try {
            const payload =
                updateAreaSchema.parse(
                    req.body
                );

            const result =
                await adminService
                    .updateArea(
                        req.params.areaId,
                        payload
                    );

            return res.status(200).json({
                success: true,
                message:
                    "Area updated successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const getRateCards =
    async (req, res, next) => {
        try {
            const result =
                await adminService
                    .getRateCards();

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

// const createRateCard =
//     async (req, res, next) => {
//         try {
//             const payload =
//                 createRateCardSchema.parse(
//                     req.body
//                 );

//             const result =
//                 await adminService
//                     .createRateCard(payload);

//             return res.status(201).json({
//                 success: true,
//                 message:
//                     "Rate card created successfully",
//                 data: result,
//             });
//         } catch (error) {
//             next(error);
//         }
//     };

const createRateCard = async (req, res, next) => {
    try {
        console.log(
            "Creating/updating rate card:",
            JSON.stringify(req.body, null, 2)
        );

        const payload =
            createRateCardSchema.parse(req.body);

        console.log(
            "Validated rate card:",
            JSON.stringify(payload, null, 2)
        );

        const rateCard =
            await adminService.createRateCard(
                payload
            );

        return res.status(201).json({
            success: true,
            message:
                "Rate card created successfully",
            data: rateCard,
        });
    } catch (error) {
        console.error(
            "RATE CARD CREATE ERROR:",
            error
        );

        next(error);
    }
};

const updateRateCard =
    async (req, res, next) => {
        try {
            const payload =
                updateRateCardSchema.parse(
                    req.body
                );

            const result =
                await adminService
                    .updateRateCard(
                        req.params.rateCardId,
                        payload
                    );

            return res.status(200).json({
                success: true,
                message:
                    "Rate card updated successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const createAgent =
    async (req, res, next) => {
        try {
            const payload =
                createAgentSchema.parse(
                    req.body
                );

            const result =
                await adminService.createAgent(
                    payload
                );

            return res.status(201).json({
                success: true,
                message:
                    "Delivery agent created successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

const updateAgent =
    async (req, res, next) => {
        try {
            const payload =
                updateAgentSchema.parse(
                    req.body
                );

            const result =
                await adminService.updateAgent(
                    req.params.agentId,
                    payload
                );

            return res.status(200).json({
                success: true,
                message:
                    "Delivery agent updated successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

module.exports = {
    getDashboard,

    getOrders,
    overrideOrderStatus,
    assignAgent,
    autoAssignAgent,

    getAgents,

    getZones,
    createZone,
    updateZone,

    getAreas,
    createArea,
    updateArea,

    getRateCards,
    createRateCard,
    updateRateCard,

    createAgent,
    updateAgent,
};