const allowedTransitions = {
    CREATED: ["ASSIGNED"],

    ASSIGNED: ["PICKED_UP"],

    PICKED_UP: ["IN_TRANSIT"],

    IN_TRANSIT: ["OUT_FOR_DELIVERY"],

    OUT_FOR_DELIVERY: [
        "DELIVERED",
        "FAILED",
    ],

    DELIVERED: [],

    FAILED: [],
};

const canTransition = (
    currentStatus,
    nextStatus
) => {
    return allowedTransitions[
        currentStatus
    ]?.includes(nextStatus);
};

module.exports = {
    allowedTransitions,
    canTransition,
};