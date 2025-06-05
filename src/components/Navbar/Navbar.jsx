import React, { useState, useContext } from "react";
import { UserContext } from "../../Pages/context/UserContext"; 
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/Cooking Pot.ico"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={Logo} alt="Logo" className="navbar-logo-image" />
          RecipeHub
        </Link>

        <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? "open" : ""}`}></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
          <li><Link to="/">Inicio</Link></li>

          {!user && (
            <li><Link to="/login" className="register-button">Iniciar Sesion</Link></li>
          )}

          {user && (
            <>
              <li><Link to="/profile" className="profile-button">Perfil</Link></li>
              <li><Link to="/publication" className="publish-button">Publicar</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
