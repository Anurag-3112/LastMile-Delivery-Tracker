const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
            trim: true,
        },

        areaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Area",
            required: true,
        },

        zoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone",
            required: true,
        },

        latitude: {
            type: Number,
        },

        longitude: {
            type: Number,
        },
    },
    {
        _id: false,
    }
);

const packageSchema = new mongoose.Schema(
    {
        length: {
            type: Number,
            required: true,
            min: 0.01,
        },

        breadth: {
            type: Number,
            required: true,
            min: 0.01,
        },

        height: {
            type: Number,
            required: true,
            min: 0.01,
        },

        actualWeight: {
            type: Number,
            required: true,
            min: 0.01,
        },

        volumetricWeight: {
            type: Number,
            required: true,
            min: 0,
        },

        billableWeight: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const pricingSchema = new mongoose.Schema(
    {
        rateCardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RateCard",
            required: true,
        },

        zoneType: {
            type: String,
            enum: ["INTRA", "INTER"],
            required: true,
        },

        baseCharge: {
            type: Number,
            required: true,
            min: 0,
        },

        codSurcharge: {
            type: Number,
            required: true,
            min: 0,
        },

        totalCharge: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
        },
    },
    {
        _id: false,
    }
);

const assignmentSchema = new mongoose.Schema(
    {
        agentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        method: {
            type: String,
            enum: ["AUTO", "MANUAL"],
            default: null,
        },

        assignedAt: {
            type: Date,
            default: null,
        },

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        pickup: {
            type: locationSchema,
            required: true,
        },

        drop: {
            type: locationSchema,
            required: true,
        },

        package: {
            type: packageSchema,
            required: true,
        },

        orderType: {
            type: String,
            enum: ["B2B", "B2C"],
            required: true,
        },

        paymentType: {
            type: String,
            enum: ["PREPAID", "COD"],
            required: true,
        },

        deliveryDate: {
            type: Date,
            default: null,
        },

        pricing: {
            type: pricingSchema,
            required: true,
        },

        assignment: {
            type: assignmentSchema,
            default: () => ({}),
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
            default: "CREATED",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index({
    "pickup.zoneId": 1,
});

orderSchema.index({
    "drop.zoneId": 1,
});

orderSchema.index({
    "assignment.agentId": 1,
});

orderSchema.index({
    status: 1,
    createdAt: -1,
});

module.exports = mongoose.model("Order", orderSchema);