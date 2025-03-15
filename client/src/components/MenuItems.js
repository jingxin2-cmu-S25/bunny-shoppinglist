import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [shoppingItems, setShoppingItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', ingredients: [] });
  const [loading, setLoading] = useState(true);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState(1);

  // Fetch all menu items and shopping items
  const fetchData = async () => {
    try {
      setLoading(true);
      const menuRes = await axios.get(`${API_URL}/menu-items`);
      const shoppingRes = await axios.get(`${API_URL}/shopping-items`);
      
      setMenuItems(menuRes.data);
      setShoppingItems(shoppingRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add ingredient to new menu item
  const addIngredient = () => {
    if (!selectedIngredient || ingredientQuantity < 1) return;
    
    // Check if ingredient is already added
    const exists = newMenuItem.ingredients.some(
      ing => ing.item === selectedIngredient
    );
    
    if (!exists) {
      setNewMenuItem({
        ...newMenuItem,
        ingredients: [
          ...newMenuItem.ingredients,
          { item: selectedIngredient, quantity: ingredientQuantity }
        ]
      });
    }
    
    setSelectedIngredient('');
    setIngredientQuantity(1);
  };

  // Remove ingredient from new menu item
  const removeIngredient = (ingredientId) => {
    setNewMenuItem({
      ...newMenuItem,
      ingredients: newMenuItem.ingredients.filter(ing => ing.item !== ingredientId)
    });
  };

  // Create new menu item
  const createMenuItem = async (e) => {
    e.preventDefault();
    if (!newMenuItem.name.trim() || newMenuItem.ingredients.length === 0) return;

    try {
      const res = await axios.post(`${API_URL}/menu-items`, newMenuItem);
      setMenuItems([...menuItems, res.data]);
      setNewMenuItem({ name: '', ingredients: [] });
    } catch (err) {
      console.error('Error creating menu item:', err);
    }
  };

  // Delete menu item
  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/menu-items/${id}`);
      setMenuItems(menuItems.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting menu item:', err);
    }
  };

  // Add menu item to order (adds ingredients to shopping list)
  const addToOrder = async (menuItemId) => {
    try {
      await axios.post(`${API_URL}/orders/add-menu-item`, { menuItemId });
      alert('Menu item added to order. Ingredients added to shopping list!');
    } catch (err) {
      console.error('Error adding menu item to order:', err);
    }
  };

  // Find shopping item name by ID
  const getIngredientName = (id) => {
    const item = shoppingItems.find(item => item._id === id);
    return item ? `${item.name}${item.unit ? ` (${item.unit})` : ''}` : 'Unknown item';
  };

  return (
    <div className="menu-items">
      <h2>Menu Items</h2>
      
      <form onSubmit={createMenuItem} className="menu-form">
        <div className="form-group">
          <label htmlFor="menuName">Menu Item Name:</label>
          <input
            type="text"
            id="menuName"
            value={newMenuItem.name}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
            placeholder="Enter menu item name"
            required
          />
        </div>
        
        <div className="ingredients-section">
          <h3>Add Ingredients</h3>
          <div className="ingredient-selection">
            <select 
              value={selectedIngredient} 
              onChange={(e) => setSelectedIngredient(e.target.value)}
            >
              <option value="">Select an ingredient</option>
              {shoppingItems.map(item => (
                <option key={item._id} value={item._id}>
                  {item.name} {item.unit ? `(${item.unit})` : ''}
                </option>
              ))}
            </select>
            
            <input
              type="number"
              min="1"
              value={ingredientQuantity}
              onChange={(e) => setIngredientQuantity(parseInt(e.target.value))}
            />
            
            <button 
              type="button" 
              onClick={addIngredient}
              className="btn"
            >
              Add Ingredient
            </button>
          </div>
          
          <ul className="selected-ingredients">
            {newMenuItem.ingredients.map((ing, index) => (
              <li key={index} className="selected-ingredient">
                {getIngredientName(ing.item)} x {ing.quantity}
                <button 
                  type="button" 
                  onClick={() => removeIngredient(ing.item)}
                  className="btn btn-small"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!newMenuItem.name || newMenuItem.ingredients.length === 0}
        >
          Create Menu Item
        </button>
      </form>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="menu-items-list">
          <h3>Menu Items</h3>
          {menuItems.length === 0 ? (
            <p>No menu items available. Create some!</p>
          ) : (
            menuItems.map(item => (
              <div key={item._id} className="menu-item">
                <h4>{item.name}</h4>
                <p>Ingredients:</p>
                <ul className="ingredients-list">
                  {item.ingredients.map((ing, index) => (
                    <li key={index}>
                      {ing.item.name} {ing.item.unit ? `(${ing.item.unit})` : ''} x {ing.quantity}
                    </li>
                  ))}
                </ul>
                <div className="menu-item-actions">
                  <button 
                    onClick={() => addToOrder(item._id)}
                    className="btn btn-success"
                  >
                    Add to Order
                  </button>
                  <button 
                    onClick={() => deleteMenuItem(item._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MenuItems; 