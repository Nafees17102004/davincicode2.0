import React from "react";
import { Link } from "react-router-dom";
import "./LeftTabMenu.css";

function LeftTabMenu() {
  return (
    <div className="left-tab-menu">
      <ul className="menu-list">
        <li className="menu-item">
          <Link to="/" className="nav-link">
            Language
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/project" className="nav-link">
            Project
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/field" className="nav-link">
            Field
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/snippet" className="nav-link">
            Snippet
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/lov" className="nav-link">
            List of values
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default LeftTabMenu;
