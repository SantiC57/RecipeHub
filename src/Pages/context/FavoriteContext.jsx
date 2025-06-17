import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [likedRecipes, setLikedRecipes] = useState(new Set());
  const [favoriteRecipesDetails, setFavoriteRecipesDetails] = useState([]);

  // Load liked recipes from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedRecipes');
    if (savedLikes) {
      try {
        const likesArray = JSON.parse(savedLikes);
        setLikedRecipes(new Set(likesArray));
      } catch (error) {
        console.error('Error loading liked recipes from localStorage:', error);
      }
    }
  }, []);

  // Save liked recipes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('likedRecipes', JSON.stringify(Array.from(likedRecipes)));
  }, [likedRecipes]);

  const toggleLike = (recipeId) => {
    setLikedRecipes(prev => {
      const newLikedRecipes = new Set(prev);
      if (newLikedRecipes.has(recipeId)) {
        newLikedRecipes.delete(recipeId);
        // Remove from details when unliked
        setFavoriteRecipesDetails(prevDetails => 
          prevDetails.filter(recipe => recipe.id !== recipeId)
        );
      } else {
        newLikedRecipes.add(recipeId);
      }
      return newLikedRecipes;
    });
  };

  const addToFavoriteDetails = (recipe) => {
    setFavoriteRecipesDetails(prev => {
      // Check if recipe already exists
      const exists = prev.some(r => r.id === recipe.id);
      if (!exists) {
        return [...prev, recipe];
      }
      return prev;
    });
  };

  const removeLike = (recipeId) => {
    setLikedRecipes(prev => {
      const newLikedRecipes = new Set(prev);
      newLikedRecipes.delete(recipeId);
      return newLikedRecipes;
    });
    
    setFavoriteRecipesDetails(prev => 
      prev.filter(recipe => recipe.id !== recipeId)
    );
  };

  const isLiked = (recipeId) => {
    return likedRecipes.has(recipeId);
  };

  const getLikedRecipesCount = () => {
    return likedRecipes.size;
  };

  const value = {
    likedRecipes,
    favoriteRecipesDetails,
    toggleLike,
    removeLike,
    isLiked,
    getLikedRecipesCount,
    addToFavoriteDetails
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};