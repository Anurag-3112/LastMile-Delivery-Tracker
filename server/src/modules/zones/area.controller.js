const areaService = require("./area.service");

const createArea = async (req, res, next) => {
    try {
        const area = await areaService.createArea(req.body);

        res.status(201).json({
            success: true,
            message: "Area created successfully",
            data: {
                area,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getAreas = async (req, res, next) => {
    try {
        const areas = await areaService.getAreas({
            zoneId: req.query.zoneId,
        });

        res.status(200).json({
            success: true,
            data: {
                areas,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createArea,
    getAreas,
};