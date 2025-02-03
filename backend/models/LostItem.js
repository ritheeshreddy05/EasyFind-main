const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    dateLost: {
        type: Date,
        default: Date.now,
    },
    contactInfo: {
        type: String,
        required: true,
    },
    foundBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

module.exports = mongoose.model('LostItem', LostItemSchema);