import React from 'react';
import { getAvatarUrl } from '../../lib/utils';
import './RecipeTooltip.css';

const RecipeTooltip = ({ 
  recipe, 
  details, 
  isLoading, 
  isFeatured = false,
  className = ""
}) => {
  if (isLoading) {
    return (
      <div className={`recipe-tooltip ${isFeatured ? 'featured-tooltip' : ''} ${className}`}>
        <div className="tooltip-loading">
          <div className="loading-spinner"></div>
          <span>Cargando detalles...</span>
        </div>
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className={`recipe-tooltip ${isFeatured ? 'featured-tooltip' : ''} ${className}`}>
      <div className="tooltip-header">
        <h4 className="tooltip-title">{details.titulo}</h4>
        <span className="tooltip-category">{details.categoria}</span>
      </div>
      
      <div className="tooltip-author">
        <img 
          src={getAvatarUrl(details.autor)} 
          alt={details.autor?.name || 'Usuario'} 
          className="author-avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=U&background=e8b44a&color=fff&size=40&font-size=0.6`;
          }}
        />
        <span className="author-name">Por: {details.autor?.name || 'Usuario'}</span>
      </div>

      <div className="tooltip-times">
        <div className="time-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <span>Prep: {details.tiempo || 'No especificado'}</span>
        </div>
        {details.coccion && (
          <div className="time-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6.13 1L6 16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V1"/>
              <path d="M10 18v3"/>
              <path d="M14 18v3"/>
              <path d="M4 18h16"/>
            </svg>
            <span>Cocción: {details.coccion}</span>
          </div>
        )}
      </div>

      <div className="tooltip-ingredients">
        <h5>Ingredientes principales:</h5>
        <p>{details.ingredientes ? details.ingredientes.substring(0, 100) + '...' : 'No especificados'}</p>
      </div>

      <div className="tooltip-footer">
        <span className="tooltip-hint">Click para ver receta completa</span>
      </div>
    </div>
  );
};

export default RecipeTooltip;