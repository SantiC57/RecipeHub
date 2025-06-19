import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../lib/constants';
import { slugify } from '../lib/utils';

export const useRecipes = (user) => {
  const [recetasPublicadas, setRecetasPublicadas] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loadingUserRecipes, setLoadingUserRecipes] = useState(false);

  // Cargar recetas públicas y categorías
  useEffect(() => {
    fetch(`${API_BASE_URL}/recetas`)
      .then((res) => res.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => b.id - a.id);
        setRecetasPublicadas(sortedData);

        // Extraer categorías únicas
        const categoriesSet = new Set(
          sortedData.map((receta) => slugify(receta.categoria))
        );
        setAllCategories(Array.from(categoriesSet));
      })
      .catch((err) => console.error("Error al cargar recetas:", err));
  }, []);

  // Cargar usuarios
  useEffect(() => {
    fetch(`${API_BASE_URL}/usuarios`)
      .then(res => res.json())
      .then(data => {
        setAllUsers(data);
      })
      .catch(err => console.error("Error al cargar usuarios:", err));
  }, []);

  // Cargar recetas del usuario logueado
  useEffect(() => {
    if (user && user.id) {
      setLoadingUserRecipes(true);
      fetch(`${API_BASE_URL}/usuarios/${user.id}/recetas`)
        .then((res) => res.json())
        .then((data) => {
          const sortedUserRecipes = data.sort((a, b) => b.id - a.id);
          setUserRecipes(sortedUserRecipes);
        })
        .catch((err) => {
          console.error("Error al cargar recetas del usuario:", err);
          setUserRecipes([]);
        })
        .finally(() => {
          setLoadingUserRecipes(false);
        });
    } else {
      setUserRecipes([]);
      setLoadingUserRecipes(false);
    }
  }, [user]);

  // Funciones auxiliares
  const getLatestUserRecipe = () => {
    return userRecipes.length > 0 ? userRecipes[0] : null;
  };

  const getFeaturedRecipe = () => {
    if (user && user.id) {
      return recetasPublicadas.find(receta => receta.usuarioId !== user.id) || null;
    } else {
      return recetasPublicadas.length > 0 ? recetasPublicadas[0] : null;
    }
  };

  const getRecentRecipes = () => {
    let filteredRecipes = recetasPublicadas;

    if (user && user.id) {
      filteredRecipes = recetasPublicadas.filter(
        (receta) => receta.usuarioId !== user.id
      );
    }

    return filteredRecipes.slice(0, 6);
  };

  return {
    recetasPublicadas,
    userRecipes,
    allUsers,
    allCategories,
    loadingUserRecipes,
    getLatestUserRecipe: getLatestUserRecipe(),
    getFeaturedRecipe: getFeaturedRecipe(),
    getRecentRecipes: getRecentRecipes()
  };
};