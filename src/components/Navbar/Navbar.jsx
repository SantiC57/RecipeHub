import React, { useState } from "react";
import "./Navbar.css";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src="/src/assets/Cooking Pot.ico" alt="Logo" className="navbar-logo-image" />
          RecipeHub
        </a>
        
        {/* Hamburger button for mobile */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
          <li><a href="/">Inicio</a></li>
          <li><a href="/signup" className="register-button">Registrarse</a></li>
          <li><a href="/profile" className="profile-button">Perfil</a></li>
          <li><a href="/publication" className="publish-button">+</a></li>
        </ul>
      </div>
    </nav>
  );
}