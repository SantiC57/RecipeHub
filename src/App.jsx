import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Signup from "./components/Signup/Signup.jsx";
import Login from "./Login.jsx";
import { useEffect } from "react";
import MainPage from "./MainPage.jsx";
import Pastas from "./Pages/Pastas/Pastas.jsx";
import Carnes from "./Pages/Carnes/Carnes.jsx";
import Mariscos from "./Pages/Mariscos/Mariscos.jsx"; // Asegúrate de que las rutas sean correctas

function DynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    // Definir títulos según la ruta
    const titles = {
      "/": "Recipehub",
      "/login": "Iniciar sesión",
      "/signup": "Registro",
      "/pastas": "Recetas de Pastas", // Asegúrate de que sea minúscula
      "/carnes": "Recetas de Carnes",
      "/mariscos": "Recetas de Mariscos", // Asegúrate de que sea minúscula
    };

    document.title = titles[location.pathname] || "Recipehub";
  }, [location]);

  return null; // No renderiza nada, solo cambia el título
}

function App() {
  return (
    <Router>
      <DynamicTitle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pastas" element={<Pastas />} /> {/* Asegúrate de que la ruta sea minúscula */}
        <Route path="/carnes" element={<Carnes />} /> {/* Asegúrate de que la ruta sea minúscula */}
        <Route path="/mariscos" element={<Mariscos />} /> {/* Asegúrate de que la ruta sea minúscula */}
      </Routes>
    </Router>
  );
}

export default App;
