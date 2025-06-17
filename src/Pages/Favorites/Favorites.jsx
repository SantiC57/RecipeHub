import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar/Navbar';
import { Footer } from '../../components/footer/Footer';
import { useFavorites } from '../context/FavoriteContext';
import api from '../../api/axiosConfig';
import './Favorites.css';

const Favorites = () => {
  const { likedRecipes, removeLike, addToFavoriteDetails } = useFavorites();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      if (likedRecipes.size === 0) {
        setFavoriteRecipes([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const recipePromises = Array.from(likedRecipes).map(async (recipeId) => {
          try {
            const response = await api.get(`/recetas/${recipeId}`);
            return response.data;
          } catch (error) {
            console.error(`Error fetching recipe ${recipeId}:`, error);
            return null;
          }
        });

        const recipes = await Promise.all(recipePromises);
        const validRecipes = recipes.filter(recipe => recipe !== null);
        
        setFavoriteRecipes(validRecipes);
        
        // Add to context details for future use
        validRecipes.forEach(recipe => addToFavoriteDetails(recipe));
        
      } catch (error) {
        console.error('Error fetching favorite recipes:', error);
        setError('Error al cargar las recetas favoritas');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, [likedRecipes, addToFavoriteDetails]);

  const handleRemoveFavorite = (recipeId, event) => {
    event.preventDefault();
    event.stopPropagation();
    removeLike(recipeId);
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="favorites-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando tus recetas favoritas...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="favorites-container">
          <div className="error-state">
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="favorites-container">
        <header className="favorites-header">
          <h1 className="favorites-title">Mis Recetas Favoritas</h1>
          <p className="favorites-subtitle">
            {favoriteRecipes.length === 0 
              ? 'Aún no tienes recetas favoritas' 
              : `${favoriteRecipes.length} receta${favoriteRecipes.length > 1 ? 's' : ''} favorita${favoriteRecipes.length > 1 ? 's' : ''}`
            }
          </p>
        </header>

        {favoriteRecipes.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">❤️</div>
            <h2>No tienes recetas favoritas aún</h2>
            <p>Explora nuestras recetas y marca tus favoritas haciendo clic en el corazón</p>
            <Link to="/" className="explore-button">
              Explorar Recetas
            </Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favoriteRecipes.map((recipe) => (
              <div key={recipe.id} className="favorite-card">
                <Link to={`/recipes/${recipe.id}`} className="recipe-link">
                  <div className="recipe-image-container">
                    <img
                      src={recipe.imagen}
                      alt={recipe.titulo}
                      className="recipe-imagen"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/placeholder-recipe.jpg';
                      }}
                    />
                    <div className="recipe-category-badge">
                      {recipe.categoria}
                    </div>
                  </div>
                  
                  <div className="recipe-content">
                    <h3 className="recipe-title">{recipe.titulo}</h3>
                    
                    {recipe.tiempo && (
                      <div className="recipe-time">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        <span>{recipe.tiempo}</span>
                      </div>
                    )}
                    
                    {recipe.descripcion && (
                      <p className="recipe-description">
                        {recipe.descripcion.length > 100 
                          ? `${recipe.descripcion.substring(0, 100)}...` 
                          : recipe.descripcion
                        }
                      </p>
                    )}
                  </div>
                </Link>
                
                <button
                  className="remove-favorite-btn"
                  onClick={(e) => handleRemoveFavorite(recipe.id, e)}
                  aria-label="Quitar de favoritos"
                  title="Quitar de favoritos"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#e53e3e" stroke="#e53e3e" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Favorites;