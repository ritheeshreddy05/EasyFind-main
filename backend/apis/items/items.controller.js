const LostItem = require('../../models/LostItem');
const FoundItem = require('../../models/FoundItem');

// Submit a lost item
exports.submitLostItem = async (req, res) => {
    try {
        const lostItem = new LostItem(req.body);
        await lostItem.save();
        res.status(201).json({ message: 'Lost item submitted successfully', lostItem });
    } catch (error) {
        res.status(400).json({ message: 'Error submitting lost item', error });
    }
};

// Submit a found item
exports.submitFoundItem = async (req, res) => {
    try {
        const foundItem = new FoundItem(req.body);
        await foundItem.save();
        res.status(201).json({ message: 'Found item submitted successfully', foundItem });
    } catch (error) {
        res.status(400).json({ message: 'Error submitting found item', error });
    }
};

// Search for lost items
exports.searchLostItems = async (req, res) => {
    try {
        const lostItems = await LostItem.find(req.query);
        res.status(200).json(lostItems);
    } catch (error) {
        res.status(400).json({ message: 'Error searching for lost items', error });
    }
};

// Search for found items
exports.searchFoundItems = async (req, res) => {
    try {
        const foundItems = await FoundItem.find(req.query);
        res.status(200).json(foundItems);
    } catch (error) {
        res.status(400).json({ message: 'Error searching for found items', error });
    }
};