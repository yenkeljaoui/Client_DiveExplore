// src/components/NavBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faUser, faBell, faCog, faInfoCircle, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';

const NavBar = ({ isAuthenticated }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {isAuthenticated ? (
          <>
            <li className="navbar-item">
              <NavLink exact to="/" activeClassName="active" className="navbar-link">
                <FontAwesomeIcon icon={faHome} /> Home
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/list-of-dives" activeClassName="active" className="navbar-link">
                <FontAwesomeIcon icon={faList} /> Dives Spot

              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/personal-area" activeClassName="active" className="navbar-link">
                <FontAwesomeIcon icon={faUser} /> Personal Area
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/notifications" activeClassName="active" className="navbar-link">
                <FontAwesomeIcon icon={faBell} /> Notifications
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/settings" activeClassName="active" className="navbar-link">
                <FontAwesomeIcon icon={faCog} /> Settings
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/about" activeClassName="active" className="navbar-link">
                <FontAwesomeIcon icon={faInfoCircle} /> About
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item">
              <NavLink to="/signin" activeClassName="active" className="navbar-link">
                <FontAwesomeIcon icon={faSignInAlt} /> Sign In
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink to="/signup" activeClassName="active" className="navbar-link">
                <FontAwesomeIcon icon={faUserPlus} /> Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;