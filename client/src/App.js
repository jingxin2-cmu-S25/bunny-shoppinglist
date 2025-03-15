import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ShoppingItems from './components/ShoppingItems';
import ShoppingList from './components/ShoppingList';
import MenuItems from './components/MenuItems';

function App() {
  return (
    <Router>
      <div className="App" style={{ paddingBottom: '60px' }}>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<ShoppingList />} />
            <Route path="/shopping-items" element={<ShoppingItems />} />
            <Route path="/menu-items" element={<MenuItems />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 