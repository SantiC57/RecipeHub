import { Link } from "react-router-dom";
import React from "react";
import "./Navbar.css";
export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Recipes</h1>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Inicio</Link>
          <Link to="/about" className="navbar-link">Acerca</Link>
          <Link to="/contact-us" className="navbar-link">Contacto</Link>
        </div>
      </div>
    </nav>
  );
}
