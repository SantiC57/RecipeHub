import React, { useState, useEffect, useRef } from 'react';
import './FloatingButton.css'; 

const FloatingButton = ({ supportPageUrl = '/soporte' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          <img className="button-icon" src='/src/assets/bot.ico'/>
        </span>
      </div>
      <div 
        className={`support-menu ${isMenuOpen ? 'active' : ''}`}
        ref={menuRef}
      >
        <a href={supportPageUrl} className="support-button-floating">
          <span className='support-link-content'>  
          Ir a Página de Soporte
          <img src="/src/assets/Technical Support.ico" className="button-icon"/>
          </span>
        </a>
      </div>
    </div>
  );
};

export default FloatingButton;