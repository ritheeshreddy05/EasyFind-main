// const itemData = {
//     itemName: req.body.title,
//     description: req.body.description,
//     foundLocation: req.body.foundLocation,
//     reporterRollNo: req.body.reporterRollNo,
//     handoverLocation: 'Security Office', // Set default value
//     status: 'pending'
// };




const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            
        },
        image: {
            url: String,
            public_id: String,
            
        },
        category:{
            type:String,
            // required:true
        },
        description:{
            type:String,
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
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("FoundItem", foundItemSchema);