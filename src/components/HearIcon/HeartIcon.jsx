import React, { useContext, useState } from 'react';
import { UserContext } from '../../Pages/context/UserContext';
import { useFavorites } from '../../Pages/context/FavoriteContext';
import './HeartIcon.css';

const HeartIcon = ({ 
  recipeId, 
  recipe = null,
  className = "",
  size = 20,
  showTooltip = true,
  onAuthRequired = null
}) => {
  const { user } = useContext(UserContext);
  const { toggleLike, isLiked, addToFavoriteDetails } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const liked = user ? isLiked(recipeId) : false;

  const handleToggleLike = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Si no está logueado, ejecutar callback si existe
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    
    // Activar animación inmediatamente
    setIsAnimating(true);
    
    // Si hay datos de receta, añadirlos al cache inmediatamente
    if (recipe) {
      addToFavoriteDetails(recipe);
    }
    
    try {
      // Pasar los datos de la receta para actualizacion optimista
      await toggleLike(recipeId, recipe);
    } catch (error) {
      console.error("Error al cambiar estado de favorito:", error);
    } finally {
      // Quitar animación después de un breve delay
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }
  };

  return (
    <button 
      className={`heart-icon-button ${className} ${liked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
      onClick={handleToggleLike}
      aria-label={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
      title={showTooltip ? (liked ? "Quitar de favoritos" : "Agregar a favoritos") : ""}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill={liked ? "#e53e3e" : "none"} 
        stroke={liked ? "#e53e3e" : "currentColor"} 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
};

export default HeartIcon;