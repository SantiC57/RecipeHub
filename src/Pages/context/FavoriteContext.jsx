import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import api from '../../api/axiosConfig';
import Swal from 'sweetalert2';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState({});

  useEffect(() => {
    if (user && user.id) {
      fetchUserFavorites();
    } else {
      setLikedRecipes([]);
      setRecipeDetails({});
    }
  }, [user]);

  const fetchUserFavorites = async () => {
    try {
      const response = await api.get(`/usuarios/${user.id}/favoritos`);
      const favoriteRecipes = response.data || [];
      
      setLikedRecipes(favoriteRecipes);
      
      const detailsCache = {};
      favoriteRecipes.forEach(recipe => {
        detailsCache[recipe.id] = recipe;
      });
      setRecipeDetails(detailsCache);
      
    } catch (error) {
      console.error("Error al cargar recetas favoritas:", error);
      setLikedRecipes([]);
      setRecipeDetails({});
    }
  };

  const isLiked = (recipeId) => {
    return likedRecipes.some(recipe => recipe.id === recipeId);
  };

  const addToFavorite = async (recipeId, recipeData = null) => {
    if (!user || !user.id) return false;
    
    console.log('Agregando favorito:', { recipeId });
    
    // **ACTUALIZACIÓN OPTIMISTA INMEDIATA**
    const tempRecipe = recipeData || { 
      id: recipeId, 
      titulo: 'Cargando...', 
      imagen: '', 
      categoria: '' 
    };
    
    // Actualizar estado inmediatamente para feedback visual instantáneo
    setLikedRecipes(prev => {
      // Verificar si ya existe para evitar duplicados
      if (prev.some(recipe => recipe.id === recipeId)) {
        return prev;
      }
      return [...prev, tempRecipe];
    });
    
    if (recipeData) {
      setRecipeDetails(prev => ({
        ...prev,
        [recipeId]: recipeData
      }));
    }
    
    try {
      const response = await api.post(`/usuarios/${user.id}/favoritos`, {
        recetaId: recipeId
      });
      
      console.log('Favorito agregado exitosamente:', response.data);
      
      // Refrescar datos completos del servidor (sin bloquear la UI)
      setTimeout(() => {
        fetchUserFavorites();
      }, 100);
      
      return true;
    } catch (error) {
      console.error("Error al agregar favorito:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Si hay error, revertir el cambio optimista
      setLikedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setRecipeDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[recipeId];
        return newDetails;
      });
      
      if (error.response && error.response.status === 409) {
        console.log("La receta ya está en favoritos");
        // Re-añadir si era un error de duplicado
        if (recipeData) {
          setLikedRecipes(prev => [...prev, recipeData]);
          setRecipeDetails(prev => ({ ...prev, [recipeId]: recipeData }));
        }
        return true;
      }
      
      Swal.fire({
        title: "Error",
        text: "No se pudo agregar la receta a favoritos.",
        icon: "error",
        confirmButtonColor: "#e8b44a",
        timer: 3000,
        timerProgressBar: true
      });
      return false;
    }
  };

  const removeLike = async (recipeId) => {
    if (!user || !user.id) return false;
    
    console.log('Removiendo favorito:', { recipeId });
    
    // **ACTUALIZACIÓN OPTIMISTA INMEDIATA**
    const removedRecipe = likedRecipes.find(recipe => recipe.id === recipeId);
    
    // Actualizar estado inmediatamente para feedback visual instantáneo
    setLikedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    setRecipeDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[recipeId];
      return newDetails;
    });
    
    try {
      await api.delete(`/usuarios/${user.id}/favoritos/${recipeId}`);
      console.log('Favorito eliminado exitosamente');
      return true;
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      
      // Si hay error, revertir el cambio optimista
      if (removedRecipe) {
        setLikedRecipes(prev => [...prev, removedRecipe]);
        setRecipeDetails(prev => ({
          ...prev,
          [recipeId]: removedRecipe
        }));
      }
      
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la receta favorita.",
        icon: "error",
        confirmButtonColor: "#e8b44a",
        timer: 3000,
        timerProgressBar: true
      });
      return false;
    }
  };

  const toggleLike = async (recipeId, recipeData = null) => {
    if (!user || !user.id) return false;
    
    console.log("Toggle like para receta:", recipeId, "Usuario:", user.id);
    
    const currentlyLiked = isLiked(recipeId);
    
    if (currentlyLiked) {
      console.log("Removiendo like...");
      return await removeLike(recipeId);
    } else {
      console.log("Agregando like...");
      return await addToFavorite(recipeId, recipeData);
    }
  };

  // Función para añadir detalles de receta al cache
  const addToFavoriteDetails = (recipeData) => {
    if (recipeData && recipeData.id) {
      setRecipeDetails(prev => ({
        ...prev,
        [recipeData.id]: recipeData
      }));
    }
  };

  const getLikedRecipesCount = () => {
    return likedRecipes.length;
  };

  const getFavoriteRecipes = () => {
    return likedRecipes;
  };

  const value = {
    likedRecipes,
    toggleLike,
    removeLike,
    addToFavorite,
    isLiked,
    getLikedRecipesCount,
    getFavoriteRecipes,
    addToFavoriteDetails,
    recipeDetails
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};