import React, { useState, useContext } from "react";
import { UserContext } from "../../Pages/context/UserContext"; 
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src="/src/assets/Cooking Pot.ico" alt="Logo" className="navbar-logo-image" />
          RecipeHub
        </a>

        <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
          <li><a href="/">Inicio</a></li>

          {!user && (
            <li><a href="/signup" className="register-button">Registrarse</a></li>
          )}

          {user && (
            <>
              <li><a href="/profile" className="profile-button">Perfil</a></li>
              <li><a href="/publication" className="publish-button">Publicar</a></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
