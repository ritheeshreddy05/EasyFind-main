const express = require('express');
const router = express.Router();
// router.use(express.json());
const LostItem = require('../../models/LostItem');
const Item = require('../../models/FoundItem');
const { upload, cloudinary } = require('../../config/cloudinary')

// Submit a lost item
router.post('/lost', async (req, res) => {
    try {
        const lostItem = new LostItem(req.body);
        await lostItem.save();
        res.status(201).json({ message: 'Lost item submitted successfully', lostItem });
    } catch (error) {
        res.status(400).json({ message: 'Error submitting lost item', error });
    }
});

// Submit a found item
router.post('/found', upload.single('image'), async (req, res) => {
    try {
        // Create item data with default handoverLocation
        const itemData = {
            itemName: req.body.title,
            description: req.body.description,
            foundLocation: req.body.foundLocation,
            reporterRollNo: req.body.reporterRollNo,
            handoverLocation: 'Security Office', // Set default value
            status: 'pending'
        };

        // Add image if uploaded
        if (req.file) {
            itemData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        console.log('Creating item with data:', itemData); // Debug log

        const newItem = new Item(itemData);
        const savedItem = await newItem.save();

        res.status(201).json({
            success: true,
            item: savedItem
        });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating item'
        });
    }
});

// Search for lost items
router.get('/lost', async (req, res) => {
    try {
        const lostItems = await LostItem.find(req.query);
        res.status(200).json(lostItems);
    } catch (error) {
        res.status(400).json({ message: 'Error searching for lost items', error });
    }
});

// Search for found items
router.get('/found', async (req, res) => {
    try {
        const foundItems = await FoundItem.find(req.query);
        res.status(200).json(foundItems);
    } catch (error) {
        res.status(400).json({ message: 'Error searching for found items', error });
    }
});

module.exports = router;
