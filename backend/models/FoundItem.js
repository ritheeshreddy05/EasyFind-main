const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            
        },
        image:{
            type:String,
        },
        category: {
            type: String,
            
        },
        locationFound: {
            type: String,
           
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