const express = require('express');
const router = express.Router();
router.use(express.json());
const LostItem = require('../../models/LostItem');
const Item = require('../../models/FoundItem');
const { upload, cloudinary } = require('../../config/cloudinary')
const  auth =require('../../middlewares/auth')

// Submit a lost item
router.post('/lost', async (req, res) => {
    try {
        const lostItem = new LostItem(req.body);
        await lostItem.save();
        console.log("submitted item with details",lostItem)
        res.status(201).json({ message: 'Lost item submitted successfully', lostItem });
    } catch (error) {
        res.status(400).json({ message: 'Error submitting lost item', error });
    }
});

// Submit a found item
// Create new item
router.post('/found', upload.single('image'),auth, async (req, res) => {
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
      // Fetch all items without any query condition
      const foundItems = await Item.find();
      
      if (foundItems.length === 0) {
        return res.status(404).json({ message: 'No found items available' });
      }
  
      res.status(200).json(foundItems);
    } catch (error) {
      console.error('Error fetching found items:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/reported/:id',async(req,res)=>{
    const ID=req.params.id;
    const reportedItems=await Item.find({ reporterRollNo:ID});
    res.send(reportedItems)

  })
  router.get('/lost-items/:id',async(req,res)=>{
    const ID=req.params.id;
    const reportedItems=await LostItem.find({ email:ID});
    res.send(reportedItems)

  })

  router.delete("/reported/:id", async (req, res) => {
    try {
      const ID = req.params.id;
      const item = await Item.findById(ID);
      if (!item) return res.status(404).json({ message: "Item not found" });
      if (item.status === "approved") return res.status(403).json({ message: "Cannot delete an approved item" });
  
      const deletedItem = await Item.findOneAndDelete({ _id: ID });
      res.json({ message: "Delete successful", payload: deletedItem });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  router.delete("/delete-lostItem/:id", async (req, res) => {
    try {
      const ID = req.params.id;
      const item = await LostItem.findById(ID);
      if (!item) return res.status(404).json({ message: "Item not found" });
      if (item.status === "approved") return res.status(403).json({ message: "Cannot delete an approved item" });
  
      const deletedItem = await LostItem.findOneAndDelete({ _id: ID });
      res.json({ message: "Delete successful", payload: deletedItem });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

   
  
module.exports = router;
