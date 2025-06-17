import React from 'react';
import { useFavorites } from '../../Pages/context/FavoritesContext';
import './HeartIcon.css';

const HeartIcon = ({ 
  recipeId, 
  recipe = null,
  className = "",
  size = 20,
  showTooltip = true 
}) => {
  const { toggleLike, isLiked, addToFavoriteDetails } = useFavorites();
  const liked = isLiked(recipeId);

  const handleToggleLike = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // If recipe data is provided, add it to favorites context for caching
    if (recipe && !liked) {
      addToFavoriteDetails(recipe);
    }
    
    toggleLike(recipeId);
  };

  return (
    <button 
      className={`heart-icon-button ${className} ${liked ? 'liked' : ''}`}
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
        className="heart-svg"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
};

export default HeartIcon;