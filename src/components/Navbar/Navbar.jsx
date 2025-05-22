import React from "react";
import "./Navbar.css";
import { Link } from 'react-router-dom';
import { useAuth } from '../../Contexto/AuthContext'; // <--- RUTA CORREGIDA

export function Navbar() {
  const { currentUser, isLoggedIn, logout } = useAuth();

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img
            src="/src/assets/Cooking Pot.ico"
            alt="Logo RecipeHub"
            className="navbar-logo-image"
          />
          RecipeHub
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/">Inicio</Link></li>

          {!isLoggedIn ? (
            <>
              <li><Link to="/login" className="login-button">Iniciar Sesión</Link></li>
              <li><Link to="/signup" className="register-button">Registrarse</Link></li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile" className="profile-link">
                  <div className="profile-avatar">
                    {currentUser.profilePic ? (
                      <img
                        src={currentUser.profilePic}
                        alt="Foto de perfil"
                        className="avatar-image"
                      />
                    ) : (
                      <span className="avatar-initial">
                        {getUserInitial(currentUser.name)}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
              <li><Link to="/publication" className="publish-button">+</Link></li>
              <li><button onClick={logout} className="logout-button">Cerrar Sesión</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}