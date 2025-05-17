import React, { useState, useEffect, useRef } from 'react';
import './FloatingButton.css'; // Asumiendo que el CSS estará en un archivo separado

const FloatingButton = ({ supportPageUrl = '/soporte' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cierra el menú al hacer clic fuera del botón o del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target) && 
        menuRef.current && 
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="floating-container">
      <div 
        className="floating-button" 
        onClick={toggleMenu}
        ref={buttonRef}
      >
        <span>
          Canales de Soporte
          <div className="button-icon">👨‍💻</div>
        </span>
      </div>
      <div 
        className={`support-menu ${isMenuOpen ? 'active' : ''}`}
        ref={menuRef}
      >
        <a href={supportPageUrl} className="support-button">
          Ir a Página de Soporte
        </a>
      </div>
    </div>
  );
};

export default FloatingButton;