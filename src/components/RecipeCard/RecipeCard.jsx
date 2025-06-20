import React from 'react';
import { Link } from 'react-router-dom';
import HeartIcon from '../HearIcon/HeartIcon';
import RecipeTooltip from './RecipeTooltip';
import Add from '../../assets/Add.ico';
import './RecipeCard.css';

const RecipeCard = ({ 
  user,
  userRecipe,
  featuredRecipe,
  loadingUserRecipes,
  hoveredRecipe,
  recipeDetails,
  loadingDetails,
  onRecipeHover,
  onRecipeLeave,
  onAuthRequired
}) => {
  // Renderizar contenido para usuario logueado
  if (user) {
    if (loadingUserRecipes) {
      return (
        <div className="recipe-card">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando tus recetas...</p>
          </div>
        </div>
      );
    }

    if (userRecipe) {
      return (
        <div className="recipe-card">
          <Link to={`/myrecipes/${user.id}`} className="featured-link">
            <h3 className="destacada-titulo">Mis Recetas</h3>
            <img
              className="destacada-imagen"
              src={userRecipe.imagen}
              alt={userRecipe.titulo}
              loading="lazy"
            />
            <div className="featured-overlay">
              <span className="featured-badge">¡Tu Receta!</span>
            </div>
            <div className="destacada-info">{userRecipe.titulo}</div>
          </Link>
        </div>
      );
    }

    // Si no tiene recetas
    return (
      <div className="recipe-card">
        <section className="start-cooking">
          <img src={Add} alt="Icono de agregar receta" />
          <h2 className="start-cooking__title">¿Listo para Cocinar?</h2>
          <p className="start-cooking__subtitle">Comienza creando tu primera receta</p>
          <Link to="/publication">
            <button className="start-cooking__button">Crear Receta</button>
          </Link>
        </section>
      </div>
    );
  }

  // Renderizar contenido para usuario no logueado
  if (featuredRecipe) {
    return (
      <div className="recipe-card">
        <div className="featured-recipe-wrapper">
          <Link 
            to={`/recipes/${featuredRecipe.id}`} 
            className="featured-link"
            onMouseEnter={() => onRecipeHover(featuredRecipe.id)}
            onMouseLeave={onRecipeLeave}
          >
            <h3 className="destacada-titulo">Receta Destacada</h3>
            <img
              className="destacada-imagen"
              src={featuredRecipe.imagen}
              alt={featuredRecipe.titulo}
              loading="lazy"
            />
            <div className="featured-overlay">
              <span className="featured-badge">¡Nueva!</span>
            </div>
            <div className="destacada-info">{featuredRecipe.titulo}</div>
          </Link>
          
          {/* Corazón para receta destacada */}
          <HeartIcon 
            recipeId={featuredRecipe.id} 
            recipe={featuredRecipe}
            className="featured-heart" 
            onAuthRequired={onAuthRequired}
          />
          
          {hoveredRecipe === featuredRecipe.id && (
            <RecipeTooltip 
              recipe={featuredRecipe}
              details={recipeDetails[featuredRecipe.id]}
              isLoading={loadingDetails[featuredRecipe.id]}
              isFeatured={true}
            />
          )}
        </div>
      </div>
    );
  }

  // Fallback si no hay receta destacada
  return (
    <div className="recipe-card">
      <div className="no-featured-recipe">
        <h3 className="destacada-titulo">Receta destacada</h3>
        <div className="destacada-imagen-placeholder">
          <span>Sin imagen disponible</span>
        </div>
        <div className="destacada-info">Sin receta destacada</div>
      </div>
    </div>
  );
};

export default RecipeCard;