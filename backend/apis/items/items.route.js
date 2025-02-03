const express = require('express');
const router = express.Router();
const itemsController = require('./items.controller');

// Route to submit a found item
router.post('/found', itemsController.submitFoundItem);

// Route to submit a lost item
router.post('/lost', itemsController.submitLostItem);

// Route to search for found items
router.get('/found', itemsController.searchFoundItems);

// Route to search for lost items
router.get('/lost', itemsController.searchLostItems);

module.exports = router;