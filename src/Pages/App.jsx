import { BrowserRouter as Router, Routes, Route, useLocation,useParams  } from "react-router-dom";
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
      "/publication": "Publicar receta",
      "/profile": "Mi perfil",
      "/Support": "Soporte"
    };
    document.title = titles[location.pathname] || "Recipehub";
  }, [location]);
  
  return null;
}

// Componente wrapper para InteractiveRecipeGuide
function InteractiveRecipeWrapper() {
  const { id } = useParams();
  return <InteractiveRecipeGuide recipeId={parseInt(id)} />;
}

function App() {
  // Corrección: devolvemos el valor del localStorage
  const [currentUser, setCurrentUser] = useState(() => 
    JSON.parse(localStorage.getItem("currentUser"))
  );
 
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  
  // Corrección: añadimos los corchetes en la dependencia
  useEffect(() => {
    if(currentUser){
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
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
  
  // Esta función ya no se usará directamente, los componentes hacen llamadas API directas
  const handleRecipeSubmit = async (recipe) => {
    try {
      const response = await api.post('/recetas', recipe);
      setRecipes(response.data);
    } catch (error) {
      console.error("Error al refrescar las recetas:", error);
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
        <Route path="/mariscos" element={<Mariscos/>} />
        <Route path="/support" element={<Support />} />
        <Route path="/publication" element={<Publication onSubmit={handleRecipeSubmit} currentUser={currentUser} />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/receta/:id" element={<RecipeDetail />} />
        <Route path="/recipes/:id" element={<InteractiveRecipeWrapper />} />
        <Route path="/postres" element={<Postres />} />
        <Route path="/sopas" element={<Sopas />} />
        <Route path="/ensaladas" element={<Ensaladas />} />
        <Route path="/salsas" element={<Salsas />} />

      </Routes>
    </Router>
  );
}

export default App;