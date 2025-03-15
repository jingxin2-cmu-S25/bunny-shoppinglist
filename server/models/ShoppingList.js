const mongoose = require('mongoose');

const ShoppingListSchema = new mongoose.Schema({
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShoppingItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ShoppingList', ShoppingListSchema); 