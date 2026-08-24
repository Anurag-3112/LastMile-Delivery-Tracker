const zoneService = require("./zone.service");

const createZone = async (req, res, next) => {
    try {
        const zone = await zoneService.createZone(req.body);

        res.status(201).json({
            success: true,
            message: "Zone created successfully",
            data: {
                zone,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getZones = async (req, res, next) => {
    try {
        const zones = await zoneService.getZones();

        res.status(200).json({
            success: true,
            data: {
                zones,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createZone,
    getZones,
};