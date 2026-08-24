const Area = require("../../models/Area");
const Zone = require("../../models/Zone");

const createArea = async ({
    name,
    code,
    pincode,
    zoneId,
}) => {
    const zone = await Zone.findOne({
        _id: zoneId,
        isActive: true,
    });

    if (!zone) {
        const error = new Error("Active zone not found");
        error.statusCode = 404;
        error.code = "ZONE_NOT_FOUND";
        throw error;
    }

    const existingArea = await Area.findOne({
        pincode,
        isActive: true,
    });

    if (existingArea) {
        const error = new Error(
            "An active area already exists for this pincode"
        );

        error.statusCode = 409;
        error.code = "AREA_ALREADY_EXISTS";

        throw error;
    }

    return Area.create({
        name,
        code: code.toUpperCase(),
        pincode,
        zoneId,
    });
};

const getAreas = async ({ zoneId }) => {
    const filter = {
        isActive: true,
    };

    if (zoneId) {
        filter.zoneId = zoneId;
    }

    return Area.find(filter)
        .populate("zoneId", "name code")
        .sort({ name: 1 });
};

module.exports = {
    createArea,
    getAreas,
};