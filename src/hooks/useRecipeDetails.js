import { useState } from 'react';
import api from '../api/axiosConfig';
import { useFavorites } from '../Pages/context/FavoriteContext';

export const useRecipeDetails = () => {
  const [hoveredRecipe, setHoveredRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  
  const { addToFavoriteDetails } = useFavorites();

  const fetchRecipeDetails = async (recipeId) => {
    if (recipeDetails[recipeId] || loadingDetails[recipeId]) return;
    
    setLoadingDetails(prev => ({ ...prev, [recipeId]: true }));
    
    try {
      const recipeResponse = await api.get(`/recetas/${recipeId}`);
      const recipeData = recipeResponse.data;
      
      const userResponse = await api.get(`/usuarios/${recipeData.usuarioId}`);
      const userData = userResponse.data;
      
      const fullRecipeData = {
        ...recipeData,
        autor: userData
      };
      
      setRecipeDetails(prev => ({
        ...prev,
        [recipeId]: fullRecipeData
      }));
      
      // Add to favorites context for caching
      addToFavoriteDetails(fullRecipeData);
    } catch (error) {
      console.error("Error al cargar detalles de la receta:", error);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [recipeId]: false }));
    }
  };

  const handleRecipeHover = (recipeId) => {
    setHoveredRecipe(recipeId);
    fetchRecipeDetails(recipeId);
  };

  const handleRecipeLeave = () => {
    setHoveredRecipe(null);
  };

  return {
    hoveredRecipe,
    recipeDetails,
    loadingDetails,
    handleRecipeHover,
    handleRecipeLeave
  };
};