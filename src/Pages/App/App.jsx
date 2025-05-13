import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Signup from "../../components/Signup/Signup.jsx";
import Login from "../Login/Login.jsx";
import { useEffect } from "react";
import MainPage from "../Main/MainPage.jsx";
import Pastas from "../Pastas/Pastas.jsx";
import Carnes from "../Carnes/Carnes.jsx";
import Mariscos from "../Mariscos/Mariscos.jsx";
import ContactUs from "../Contact/contact-us.jsx";
import Publication from "../Publication/Publication.jsx";
import Profile from "../Profile/Profile.jsx";
import { useState } from "react";
import api from "../../api/axiosConfig.js";

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
    };

    document.title = titles[location.pathname] || "Recipehub";
  }, [location]);

  return null;
}

function App() {
  
  const [currentUser, setCurrentUser] = useState(()=> {
    JSON.parse(localStorage.getItem("currentUser"));
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    if(currentUser){
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }else{
      localStorage.removeItem("currentUser");
    }
  },currentUser);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSubmit = async (user) => {
    try {
      if (user.id) {
        const response = await api.put(`/usuarios/${user.id}`, user)
        setUsers(users.map(u => u.id === user.id ? response.data : u));
      }
      else {
        const response = await api.post('/usuarios', user)
        setUsers([...users, response.data]);
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  }

  return (
    <Router>
      <DynamicTitle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login onLogin={setCurrentUser}/>} />
        <Route path="/signup" element={<Signup onSubmit={handleUserSubmit} selectedUser={currentUser} />} />
        <Route path="/pastas" element={<Pastas />} />
        <Route path="/carnes" element={<Carnes />} />
        <Route path="/mariscos" element={<Mariscos />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/publication" element={<Publication />} />
        <Route path="/profile" element={<Profile />} />
        {/* Agrega más rutas según sea necesario */}

      </Routes>
    </Router>
  );
}

export default App;
