const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        locationFound: {
            type: String,
            required: true
        },
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        status: {
            type: String,
            enum: ["pending", "verified", "claimed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("FoundItem", foundItemSchema);