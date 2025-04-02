import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Signup from "./components/Signup/Signup.jsx";
import Login from "./Login.jsx";
import {useEffect} from "react";
import MainPage from "./MainPage.jsx";

function DynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    // Definir títulos según la ruta
    const titles = {
      "/": "Recipehub",
      "/login": "Iniciar sesión",
      "/signup": "Registro",
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
      </Routes>
    </Router>
  );
}

export default App;
