import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ShoppingItems from './components/ShoppingItems';
import ShoppingList from './components/ShoppingList';
import MenuItems from './components/MenuItems';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<ShoppingList />} />
            <Route path="/shopping-items" element={<ShoppingItems />} />
            <Route path="/menu-items" element={<MenuItems />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 