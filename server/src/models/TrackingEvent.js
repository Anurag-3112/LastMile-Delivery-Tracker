const mongoose = require("mongoose");

const trackingEventSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        status: {
            type: String,
            enum: [
                "CREATED",
                "ASSIGNED",
                "PICKED_UP",
                "IN_TRANSIT",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "FAILED",
            ],
            required: true,
        },

        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        actorRole: {
            type: String,
            enum: [
                "CUSTOMER",
                "DELIVERY_AGENT",
                "ADMIN",
                "SYSTEM",
            ],
            required: true,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

trackingEventSchema.index({
    orderId: 1,
    createdAt: 1,
});

module.exports = mongoose.model(
    "TrackingEvent",
    trackingEventSchema
);