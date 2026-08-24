const mongoose = require("mongoose");

const notificationSchema =
    new mongoose.Schema(
        {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
                required: true,
                index: true,
            },

            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            type: {
                type: String,
                enum: [
                    "ORDER_CREATED",
                    "ORDER_ASSIGNED",
                    "PICKED_UP",
                    "IN_TRANSIT",
                    "OUT_FOR_DELIVERY",
                    "DELIVERED",
                    "FAILED",
                    "RESCHEDULED",
                ],
                required: true,
            },

            channel: {
                type: String,
                enum: [
                    "EMAIL",
                    "SMS",
                ],
                required: true,
            },

            status: {
                type: String,
                enum: [
                    "PENDING",
                    "SENT",
                    "FAILED",
                ],
                default: "PENDING",
            },

            providerMessageId: {
                type: String,
                default: null,
            },

            failureReason: {
                type: String,
                default: null,
            },

            sentAt: {
                type: Date,
                default: null,
            },
        },
        {
            timestamps: true,
        }
    );

notificationSchema.index({
    orderId: 1,
    createdAt: -1,
});

module.exports =
    mongoose.model(
        "Notification",
        notificationSchema
    );