import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Signup from "../components/Signup/Signup.jsx";
import Login from "./Login/Login.jsx";
import { useEffect } from "react";
import MainPage from "./Main/MainPage.jsx";
import Pastas from "./Pastas/Pastas.jsx";
import Carnes from "./Carnes/Carnes.jsx";
import Mariscos from "./Mariscos/Mariscos.jsx";
import ContactUs from "./Contact/contact-us.jsx";
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
      "/contact-us": "Contáctanos"
    };
    document.title = titles[location.pathname] || "Recipehub";
  }, [location]);
  
  return null;
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
      // Esta función se mantiene para compatibilidad, pero la Publication.jsx ahora hace su propia llamada a la API
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
      <Routes>
        <Route path="/" element={<MainPage recipes={recipes} />} />
        <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/signup" element={<Signup onSubmit={handleUserSubmit} onLogin={setCurrentUser} />} />
        <Route path="/pastas" element={<Pastas />} />
        <Route path="/carnes" element={<Carnes />} />
        <Route path="/mariscos" element={<Mariscos/>} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/publication" element={<Publication onSubmit={handleRecipeSubmit} onLogin={setCurrentUser} currentUser={currentUser} />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/profile" element={<Profile />} />
        {/* Agrega más rutas según sea necesario */}

        <Route 
          path="/publication" 
          element={
            <Publication 
              onSubmit={handleRecipeSubmit} 
              currentUser={currentUser}
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;