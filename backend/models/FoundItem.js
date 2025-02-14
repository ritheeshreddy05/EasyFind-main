const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true
        },
        itemName: {
            type: String,
        },
        image: {
            url: String,
            public_id: String,
        },
        category: {
            type: String,
        },
        description: {
            type: String,
        },
        foundLocation: {
            type: String,
        },
        reporterRollNo: {
            type: String,
        },
        handoverLocation: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "verified", "claimed"],
            default: "pending"
        },
        claimerDetails: {
            name: {
                type: String,
            },
            rollNo: {
                type: String,
            },
            proofs: [
                {
                    url: String,
                    public_id: String,
                }
            ]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("FoundItem", foundItemSchema);
