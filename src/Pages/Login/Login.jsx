import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import api from "../../api/axiosConfig.js";
import { useAuth } from "../../Contexto/AuthContext.jsx"; // <--- Importa useAuth desde la carpeta Contexto

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // <--- Obtenemos la función 'login' del contexto
  const [user, setUser] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!user.email.trim()) newErrors.email = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = "Correo electrónico inválido";
    if (!user.password) newErrors.password = "La contraseña es obligatoria";
    else if (user.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const { data } = await api.post("/usuarios/login", {
        email: user.email,
        password: user.password,
      });

      // Ya no necesitamos localStorage.setItem("currentUser", ...) directamente aquí
      // porque la función `login` del AuthContext se encarga de eso.
      login(data.user); // <--- Llama a la función 'login' del contexto con los datos del usuario

      // navigate("/"); // La función 'login' del contexto ya maneja el window.location.reload()
                     // lo que simula la navegación y actualización completa de la página.
                     // Si en el futuro cambias a una navegación sin recarga, puedes usar navigate('/') aquí.

    } catch (error) {
      console.error("Error al iniciar sesión", error);

      let errorMsg = "Error al iniciar sesión. Por favor, intenta de nuevo.";

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 401) {
          errorMsg = "Correo o contraseña incorrectos.";
        } else if (status === 404 || message?.toLowerCase().includes("no encontrado")) {
          errorMsg = "Usuario no encontrado. Serás redirigido para registrarte.";

          setErrors({ ...errors, general: errorMsg });
          setTimeout(() => {
            navigate("/signup");
          }, 2500);
          return;
        }
      }

      setErrors({ ...errors, general: errorMsg });
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title">Iniciar Sesión</h2>
        {errors.general && <p className="login__error">{errors.general}</p>}
        <div className="login__group">
          <label htmlFor="email" className="login__label">Correo Electrónico</label>
          <input type="text" id="email" className="login__input" name="email" value={user.email} placeholder="Usuario" onChange={handleChange} />
        </div>
        {errors.email && <p className="login__error">{errors.email}</p>}
        <div className="login__group">
          <label htmlFor="password" className="login__label">Contraseña</label>
          <input type="password" id="password" className="login__input" name="password" value={user.password} placeholder="Contraseña" onChange={handleChange} />
        </div>
        {errors.password && <p className="login__error">{errors.password}</p>}
        <button type="submit" className="login__button">{isLoading ? "Verificando..." : "Ingresar"}</button>

        <p className="login__register">
          ¿No tienes cuenta? <a href="/signup">Regístrate</a></p>
      </form>
    </div>
  );
};

export default Login;