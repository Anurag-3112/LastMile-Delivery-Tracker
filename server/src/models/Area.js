const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        code: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            maxlength: 30,
        },

        pincode: {
            type: String,
            required: true,
            trim: true,
            match: /^[0-9]{6}$/,
        },

        zoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone",
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

areaSchema.index({ pincode: 1 });
areaSchema.index({ zoneId: 1 });

module.exports = mongoose.model("Area", areaSchema);