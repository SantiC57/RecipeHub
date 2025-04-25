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
  return (
    <Router>
      <DynamicTitle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pastas" element={<Pastas />} /> 
        <Route path="/carnes" element={<Carnes />} /> 
        <Route path="/mariscos" element={<Mariscos />} /> 
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/publication" element={<Publication />} />

      </Routes>
    </Router>
  );
}

export default App;
