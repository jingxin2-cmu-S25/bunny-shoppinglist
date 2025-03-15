const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const ShoppingList = require('../models/ShoppingList');

// Add menu item to order (adds ingredients to shopping list)
router.post('/add-menu-item', async (req, res) => {
  try {
    const { menuItemId } = req.body;
    
    // Get the menu item with its ingredients
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Get or create shopping list
    let shoppingList = await ShoppingList.findOne();
    if (!shoppingList) {
      shoppingList = new ShoppingList({ items: [] });
    }
    
    // Add each ingredient to the shopping list
    for (const ingredient of menuItem.ingredients) {
      const existingItemIndex = shoppingList.items.findIndex(
        item => item.item.toString() === ingredient.item.toString()
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        shoppingList.items[existingItemIndex].quantity += ingredient.quantity;
      } else {
        // Add new item to list
        shoppingList.items.push({
          item: ingredient.item,
          quantity: ingredient.quantity
        });
      }
    }
    
    shoppingList.updatedAt = Date.now();
    await shoppingList.save();
    
    const updatedList = await ShoppingList.findById(shoppingList._id).populate('items.item');
    res.json(updatedList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 