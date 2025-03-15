const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/ShoppingList');

// Get the shopping list
router.get('/', async (req, res) => {
  try {
    let list = await ShoppingList.findOne().populate('items.item');
    
    if (!list) {
      // Create new shopping list if it doesn't exist
      list = new ShoppingList({ items: [] });
      await list.save();
    }
    
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to shopping list
router.post('/add-item', async (req, res) => {
  try {
    let list = await ShoppingList.findOne();
    
    if (!list) {
      list = new ShoppingList({ items: [] });
    }
    
    // Check if item is already in the list
    const existingItemIndex = list.items.findIndex(
      listItem => listItem.item.toString() === req.body.itemId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      list.items[existingItemIndex].quantity += req.body.quantity || 1;
    } else {
      // Add new item to list
      list.items.push({
        item: req.body.itemId,
        quantity: req.body.quantity || 1
      });
    }
    
    list.updatedAt = Date.now();
    await list.save();
    
    const updatedList = await ShoppingList.findById(list._id).populate('items.item');
    res.json(updatedList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove item from shopping list
router.delete('/remove-item/:itemId', async (req, res) => {
  try {
    const list = await ShoppingList.findOne();
    
    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    
    list.items = list.items.filter(item => item.item.toString() !== req.params.itemId);
    list.updatedAt = Date.now();
    
    await list.save();
    const updatedList = await ShoppingList.findById(list._id).populate('items.item');
    res.json(updatedList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 