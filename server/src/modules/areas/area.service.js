const Area = require("../../models/Area");

const getAreas = async ({
    zoneId,
} = {}) => {
    const filter = {
        isActive: true,
    };

    if (zoneId) {
        filter.zoneId = zoneId;
    }

    return Area.find(filter)
        .populate(
            "zoneId",
            "name code"
        )
        .sort({
            name: 1,
        });
};

const getAreaById = async (
    areaId
) => {
    return Area.findOne({
        _id: areaId,
        isActive: true,
    }).populate(
        "zoneId",
        "name code"
    );
};

module.exports = {
    getAreas,
    getAreaById,
};