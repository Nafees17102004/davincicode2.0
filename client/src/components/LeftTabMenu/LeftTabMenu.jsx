import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./LeftTabMenu.css";

function LeftTabMenu() {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: "🌐", label: "Language" },
    { path: "/project", icon: "📁", label: "Project" },
    { path: "/field", icon: "📊", label: "Field" },
    { path: "/snippet", icon: "📝", label: "Snippet" },
    { path: "/lov", icon: "📋", label: "List of Values" },
    { path: "/dynamic-form", icon: "🎨", label: "Dynamic Form" },
  ];

  return (
    <div className="left-tab-menu">
      <div className="menu-header">
        <div className="menu-title">CodeGen Pro</div>
      </div>

      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.path} className="menu-item">
            <Link
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeftTabMenu;
