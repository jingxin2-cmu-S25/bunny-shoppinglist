import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <h1>Bunny Eat 🐰 </h1>
        <ul>
          <li>
            <Link to="/">Shopping List</Link>
          </li>
          <li>
            <Link to="/shopping-items">Shopping Items</Link>
          </li>
          <li>
            <Link to="/menu-items">Menu Items</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 