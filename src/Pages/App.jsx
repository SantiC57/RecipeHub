import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Signup from "../components/Signup/Signup.jsx";
import Login from "./Login/Login.jsx";
import { useEffect } from "react";
import MainPage from "./Main/MainPage.jsx";
import Pastas from "./Pastas/Pastas.jsx";
import Carnes from "./Carnes/Carnes.jsx";
import Mariscos from "./Mariscos/Mariscos.jsx";
import Support from "./Support/support.jsx";
import Publication from "./Publication/Publication.jsx";
import Profile from "./Profile/Profile.jsx";
import RecipeDetail from "./RecipeDetail/RecipeDetail.jsx";
import { useState } from "react";
import api from "../api/axiosConfig.js";

function DynamicTitle() {
  const location = useLocation();
  
  useEffect(() => {
    const titles = {
      "/": "Recipehub",
      "/login": "Iniciar sesión",
      "/signup": "Registro",
      "/pastas": "Recetas de Pastas",
      "/carnes": "Recetas de Carnes",
      "/mariscos": "Recetas de Mariscos",
      "/publication": "Publicar receta",
      "/profile": "Mi perfil",
      "/support": "Soporte"
    };
    document.title = titles[location.pathname] || "Recipehub";
  }, [location]);
  
  return null;
}

function App() {
  // Manejo del usuario actual
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  });
 
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  
  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if(currentUser){
      try {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);
  
  // Cargar usuarios y recetas al inicio
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/recetas');
        setRecipes(response.data);
      } catch (error) {
        console.error("Error al obtener las recetas:", error);
      }
    };
    
    fetchUsers();
    fetchRecipes();
  }, []);
  
  // Función para manejar el envío de usuarios
  const handleUserSubmit = async (user) => {
    try {
      // Crear nuevo usuario
      const response = await api.post('/usuarios', user);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error al guardar el usuario:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // Función para manejar el envío de recetas
  const handleRecipeSubmit = async (recipe) => {
    try {
      const response = await api.post('/recetas', recipe);
      // Refrescar la lista de recetas después de crear una nueva
      const updatedRecipes = await api.get('/recetas');
      setRecipes(updatedRecipes.data);
    } catch (error) {
      console.error("Error al guardar/refrescar las recetas:", error);
    }
  };
  
  return (
    <Router>
      <DynamicTitle />
      <Routes>
        <Route path="/" element={<MainPage recipes={recipes} />} />
        <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/signup" element={<Signup onSubmit={handleUserSubmit} onLogin={setCurrentUser} />} />
        <Route path="/pastas" element={<Pastas />} />
        <Route path="/carnes" element={<Carnes />} />
        <Route path="/mariscos" element={<Mariscos />} />
        <Route path="/support" element={<Support />} />
        <Route path="/publication" element={<Publication onSubmit={handleRecipeSubmit} onLogin={setCurrentUser} currentUser={currentUser} />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/recipe/:id" element={<RecipeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;