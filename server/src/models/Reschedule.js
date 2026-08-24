const mongoose = require("mongoose");

const rescheduleSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true,
        },

        attemptNumber: {
            type: Number,
            required: true,
            min: 1,
        },

        previousDeliveryDate: {
            type: Date,
            default: null,
        },

        newDeliveryDate: {
            type: Date,
            required: true,
        },

        reason: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null,
        },

        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

rescheduleSchema.index({
    orderId: 1,
    attemptNumber: 1,
});

module.exports = mongoose.model(
    "Reschedule",
    rescheduleSchema
);