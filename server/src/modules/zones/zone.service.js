const Zone = require("../../models/Zone");

const createZone = async ({
    name,
    code,
}) => {
    const existing =
        await Zone.findOne({
            code,
        });

    if (existing) {
        const error =
            new Error(
                "Zone code already exists"
            );

        error.statusCode = 409;
        error.code =
            "ZONE_CODE_EXISTS";

        throw error;
    }

    return Zone.create({
        name,
        code,
    });
};

const getZones = async () => {
    return Zone.find({
        isActive: true,
    }).sort({ name: 1 });
};

module.exports = {
    createZone,
    getZones,
};