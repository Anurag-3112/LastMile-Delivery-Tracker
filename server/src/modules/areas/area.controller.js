const areaService =
    require("./area.service");

const getAreas = async (
    req,
    res,
    next
) => {
    try {
        const areas =
            await areaService.getAreas({
                zoneId:
                    req.query.zoneId,
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
    getAreas,
};