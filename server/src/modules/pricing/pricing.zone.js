const determineZoneType = ({
    pickupZoneId,
    dropZoneId,
}) => {
    if (!pickupZoneId) {
        const error = new Error(
            "Pickup zone is required"
        );

        error.statusCode = 400;
        error.code =
            "PICKUP_ZONE_REQUIRED";

        throw error;
    }

    if (!dropZoneId) {
        const error = new Error(
            "Drop zone is required"
        );

        error.statusCode = 400;
        error.code =
            "DROP_ZONE_REQUIRED";

        throw error;
    }

    const pickupId =
        pickupZoneId.toString();

    const dropId =
        dropZoneId.toString();

    if (pickupId === dropId) {
        return "INTRA";
    }

    return "INTER";
};

module.exports = {
    determineZoneType,
};