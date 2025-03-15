import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const ShoppingItems = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', unit: '' });
  const [loading, setLoading] = useState(true);

  // Fetch all shopping items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/shopping-items`);
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching shopping items:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Create new shopping item
  const createItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/shopping-items`, newItem);
      setItems([...items, res.data]);
      setNewItem({ name: '', unit: '' });
    } catch (err) {
      console.error('Error creating shopping item:', err);
    }
  };

  // Delete shopping item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/shopping-items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting shopping item:', err);
    }
  };

  return (
    <div className="shopping-items">
      <h2>Shopping Items</h2>
      
      <form onSubmit={createItem} className="item-form">
        <div className="form-group">
          <label htmlFor="name">Item Name:</label>
          <input
            type="text"
            id="name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Enter item name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="unit">Unit (optional):</label>
          <input
            type="text"
            id="unit"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            placeholder="e.g. kg, piece, liter"
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Item</button>
      </form>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="items-list">
          {items.length === 0 ? (
            <p>No shopping items available. Add some!</p>
          ) : (
            items.map(item => (
              <li key={item._id} className="item">
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  {item.unit && <span className="item-unit">({item.unit})</span>}
                </div>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ShoppingItems; 