import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState({ items: [] });
  const [shoppingItems, setShoppingItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch shopping list and shopping items
  const fetchData = async () => {
    try {
      setLoading(true);
      const listRes = await axios.get(`${API_URL}/shopping-list`);
      const itemsRes = await axios.get(`${API_URL}/shopping-items`);
      
      setShoppingList(listRes.data);
      setShoppingItems(itemsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add item to shopping list
  const addToShoppingList = async () => {
    if (!selectedItem || itemQuantity < 1) return;
    
    try {
      const res = await axios.post(`${API_URL}/shopping-list/add-item`, {
        itemId: selectedItem,
        quantity: itemQuantity
      });
      
      setShoppingList(res.data);
      setSelectedItem('');
      setItemQuantity(1);
    } catch (err) {
      console.error('Error adding item to shopping list:', err);
    }
  };

  // Remove item from shopping list
  const removeFromShoppingList = async (itemId) => {
    try {
      const res = await axios.delete(`${API_URL}/shopping-list/remove-item/${itemId}`);
      setShoppingList(res.data);
    } catch (err) {
      console.error('Error removing item from shopping list:', err);
    }
  };

  return (
    <div className="shopping-list">
      <h2>Shopping List</h2>
      
      <div className="add-to-list-form">
        <div className="form-row">
          <select 
            value={selectedItem} 
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Select an item</option>
            {shoppingItems.map(item => (
              <option key={item._id} value={item._id}>
                {item.name} {item.unit ? `(${item.unit})` : ''}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            min="1"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(parseInt(e.target.value))}
          />
          
          <button 
            onClick={addToShoppingList}
            disabled={!selectedItem}
            className="btn btn-primary"
          >
            Add to List
          </button>
        </div>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="shopping-list-items">
          <h3>Items to Buy</h3>
          {shoppingList.items.length === 0 ? (
            <p>Your shopping list is empty!</p>
          ) : (
            <ul className="list-items">
              {shoppingList.items.map(listItem => (
                <li key={listItem._id} className="list-item">
                  <div className="list-item-details">
                    <span className="item-name">{listItem.item.name}</span>
                    {listItem.item.unit && <span className="item-unit">({listItem.item.unit})</span>}
                    <span className="item-quantity">x {listItem.quantity}</span>
                  </div>
                  <button
                    onClick={() => removeFromShoppingList(listItem.item._id)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingList; 