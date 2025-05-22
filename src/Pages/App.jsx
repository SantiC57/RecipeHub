import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

import { AuthProvider } from '../Contexto/AuthContext.jsx';
import { Navbar } from "../components/Navbar/Navbar.jsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.jsx"; // <--- Ruta de importación corregida

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
      console.log("Esta función está obsoleta, se recomienda hacer llamadas directas a la API");
      return null;
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      throw error;
    }
  };

  return (
    <Router>
      <DynamicTitle />
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<MainPage recipes={recipes} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup onSubmit={handleUserSubmit} />} />
          <Route path="/pastas" element={<Pastas />} />
          <Route path="/carnes" element={<Carnes />} />
          <Route path="/mariscos" element={<Mariscos/>} />
          <Route path="/support" element={<Support />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />

          {/* Rutas Protegidas usando el Layout Route (opción recomendada) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/publication" element={<Publication onSubmit={handleRecipeSubmit} />} />
            <Route path="/profile" element={<Profile />} />
            {/* Agrega aquí cualquier otra ruta que deba estar protegida */}
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;