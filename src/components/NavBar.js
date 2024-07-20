// src/components/NavBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ isAuthenticated }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {isAuthenticated ? (
          <>
            <li className="navbar-item">
              <NavLink exact to="/" activeClassName="active" className="navbar-link">
                Home
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/about" activeClassName="active" className="navbar-link">
                About
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item">
              <NavLink to="/signin" activeClassName="active" className="navbar-link">
                Sign In
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/signup" activeClassName="active" className="navbar-link">
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
