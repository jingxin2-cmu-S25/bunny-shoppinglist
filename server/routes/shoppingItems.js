const express = require('express');
const router = express.Router();
const ShoppingItem = require('../models/ShoppingItem');

// Get all shopping items
router.get('/', async (req, res) => {
  try {
    const items = await ShoppingItem.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a shopping item
router.post('/', async (req, res) => {
  const item = new ShoppingItem({
    name: req.body.name,
    unit: req.body.unit
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a shopping item
router.delete('/:id', async (req, res) => {
  try {
    const item = await ShoppingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    await ShoppingItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 