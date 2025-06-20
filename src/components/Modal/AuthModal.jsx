import React from 'react';
import { Link } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleModalOverlayClick}>
      <div className="auth-modal">
        <button 
          className="auth-modal-close" 
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        
        <div className="auth-modal-content">
          <div className="auth-modal-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#e53e3e" stroke="#e53e3e" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          
          <h2 className="auth-modal-title">
            ¿Quieres tener una lista de tus recetas favoritas?
          </h2>
          
          <p className="auth-modal-description">
            Inicia sesión para guardar tus recetas favoritas y acceder a ellas en cualquier momento. 
            ¡Crea tu colección personal de recetas deliciosas!
          </p>
          
          <div className="auth-modal-features">
            <div className="auth-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8b44a" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>Guarda tus recetas favoritas</span>
            </div>
            
            <div className="auth-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8b44a" strokeWidth="2">
                <path d="M9 11H1v6h8v-6z"/>
                <path d="m15 11l-8 0"/>
                <path d="m20 4l-8 0"/>
                <path d="M7 4h1v3H7V4z"/>
                <circle cx="20" cy="11" r="2"/>
              </svg>
              <span>Organiza tu colección personal</span>
            </div>
            
            <div className="auth-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8b44a" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Comparte y descubre nuevas recetas</span>
            </div>
          </div>
          
          <div className="auth-modal-actions">
            <Link 
              to="/login" 
              className="auth-modal-button auth-modal-button--primary"
              onClick={onClose}
            >
              Iniciar Sesión
            </Link>
            
            <Link 
              to="/signup" 
              className="auth-modal-button auth-modal-button--secondary"
              onClick={onClose}
            >
              Crear Cuenta
            </Link>
          </div>
          
          <button 
            className="auth-modal-skip" 
            onClick={onClose}
          >
            Continuar sin cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;