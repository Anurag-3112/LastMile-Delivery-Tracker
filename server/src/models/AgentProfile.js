const mongoose = require("mongoose");

const agentProfileSchema =
    new mongoose.Schema(
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                unique: true,
            },

            availability: {
                type: String,
                enum: [
                    "AVAILABLE",
                    "BUSY",
                    "OFFLINE",
                ],
                default: "OFFLINE",
            },

            currentLocation: {
                latitude: Number,
                longitude: Number,
            },

            currentZoneId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Zone",
                default: null,
            },

            activeOrderCount: {
                type: Number,
                default: 0,
                min: 0,
            },

            lastLocationUpdate: {
                type: Date,
                default: null,
            },
        },
        {
            timestamps: true,
        }
    );

agentProfileSchema.index({
    availability: 1,
    currentZoneId: 1,
});

module.exports =
    mongoose.model(
        "AgentProfile",
        agentProfileSchema
    );