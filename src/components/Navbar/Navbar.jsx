import { Link } from "react-router-dom";
import React from "react";
import "./Navbar.css";
// Navbar.jsx

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src="src\assets\Cooking Pot.ico" alt="Logo" className="navbar-logo-image" />
          RecipeHub
        </a>
        <ul className="navbar-menu">
          <li><a href="/">Inicio</a></li>
          <li><a href="/">Acerca de</a></li>
          <li><a href="/contact-us">Contacto</a></li>
        </ul>
      </div>
    </nav>
  );
}
