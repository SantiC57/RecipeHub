import { HashRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Signup from "../components/Signup/Signup.jsx";
import Login from "./Login/Login.jsx";
import { useEffect } from "react";
import MainPage from "./Main/MainPage.jsx";
import Pastas from "./Pastas/Pastas.jsx";
import Carnes from "./Carnes/Carnes.jsx";
import Mariscos from "./Mariscos/Mariscos.jsx";
import Support from "./Support/support.jsx";
import Publication from "../Pages/Publication/Publication.jsx";
import Profile from "./Profile/Profile.jsx";
import RecipeDetail from "./RecipeDetail/RecipeDetail.jsx";
import { useState } from "react";
import InteractiveRecipeGuide from "../components/Instructivo/InteractiveRecipeGuide.jsx";
import api from "../api/axiosConfig.js";
import Postres from "./Postres/Postres.jsx";
import Sopas from "./Sopas/Sopas.jsx";
import MyRecipes from "./Recipes/MyRecipes.jsx";
import Ensaladas from "./Ensaladas/Ensaladas.jsx";
import Salsas from "./Salsas/Salsas.jsx";

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
      "/sopas": "Recetas de Sopas",
      "/salsas": "Recetas de Salsas",
      "/ensaladas": "Recetas de Ensaladas",
      "/postres": "Recetas de postres",
      "/publication": "Publicar receta",
      "/profile": "Mi perfil",
      "/Support": "Soporte",
      "/recipes": "Mis recetas"
    };
    document.title = titles[location.pathname] || "Recipehub";
  }, [location]);

  return null;
}

function InteractiveRecipeWrapper() {
  const { id } = useParams();
  return <InteractiveRecipeGuide recipeId={parseInt(id)} />;
}

function AppRoutes() {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  
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
  
  const handleUserSubmit = async (user) => {
    try {
        const response = await api.post('/usuarios', user);
        setUsers((prevUsers) => [...prevUsers, response.data]);
        
        return response.data;
    } catch (error) {
      console.error("Error al guardar el usuario:", error.response?.data || error.message);
      throw error;
    }
  };
  
  const handleRecipeSubmit = async (recipe) => {
    try {
      const response = await api.post('/recetas', recipe);
      setRecipes(response.data);
    } catch (error) {
      console.error("Error al refrescar las recetas:", error);
    }
  };
  
  return (
    <Routes>
      <Route path="/" element={<MainPage recipes={recipes} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup onSubmit={handleUserSubmit} />} />
      <Route path="/pastas" element={<Pastas />} />
      <Route path="/carnes" element={<Carnes />} />
      <Route path="/mariscos" element={<Mariscos/>} />
      <Route path="/support" element={<Support />} />
      <Route path="/publication" element={<Publication onSubmit={handleRecipeSubmit} />} />
      <Route path="/profile" element={<Profile />} /> 
      <Route path="/receta/:id" element={<RecipeDetail />} />
      <Route path="/recipes/:id" element={<InteractiveRecipeWrapper />} />
      <Route path="/postres" element={<Postres />} />
      <Route path="/sopas" element={<Sopas />} />
      <Route path="/ensaladas" element={<Ensaladas />} />
      <Route path="/salsas" element={<Salsas />} />
      <Route path="/myrecipes/:id" element={<MyRecipes />}/> 
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <DynamicTitle />
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
