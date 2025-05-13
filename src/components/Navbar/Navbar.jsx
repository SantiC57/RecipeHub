import React from "react";
import "./Navbar.css";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src="/src/assets/Cooking Pot.ico" alt="Logo" className="navbar-logo-image" />
          RecipeHub
        </a>
        <ul className="navbar-menu">
          <li><a href="/">Inicio</a></li>
          <li><a href="/contact-us">Contacto</a></li>
          <li><a href="/signup" className="register-button">Registrarse</a></li>
          <li><a href="/profile" className="profile-button">Perfil</a></li>
          <li><a href="/publication" className="publish-button">+</a></li>
        </ul>
      </div>
    </nav>
  );
}