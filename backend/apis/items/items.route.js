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
// Create new item
router.post('/found', upload.single('image'), async (req, res) => {
    try {
        // Check if an image file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required'
            });
        }

        const { title, description, foundLocation, reporterRollNo ,category} = req.body;

        // Validate required fields
        if (!title || !description || !foundLocation || !reporterRollNo) {
            return res.status(400).json({
                success: false,
                message: 'All fields (title, description, foundLocation, reporterRollNo) are required'
            });
        }

        // Prepare item data with default handover location
        const itemData = {
            title,
            description,
            foundLocation,
            reporterRollNo,
            handoverLocation: 'Security Office',
            status: 'pending',
            image: {
                url: req.file.path,
                public_id: req.file.filename
            },
            category
        };

        console.log('Creating item with data:', itemData);

        // Save the new item to the database
        const newItem = new Item(itemData);
        const savedItem = await newItem.save();

        return res.status(201).json({
            success: true,
            item: savedItem
        });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});


// Search for found items
router.get('/found', async (req, res) => {
    try {
        const foundItems = await FoundItem.find();
        res.status(200).json(foundItems);
    } catch (error) {
        res.status(400).json({ message: 'Error searching for found items', error });
    }
});

module.exports = router;
