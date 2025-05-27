import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import api from "../../api/axiosConfig.js";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

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
    else if (user.password.length < 6) newErrors.password = "Debe tener al menos 6 caracteres";

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

      login(data.user);

      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión", error);

      let errorMsg = "Error al iniciar sesión.";
      const newErrors = {};

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 401) {
          errorMsg = "Correo o contraseña incorrectos.";
          newErrors.email = true;
          newErrors.password = true;
        } else if (status === 404 || message?.toLowerCase().includes("no encontrado")) {
          errorMsg = "Usuario no encontrado.";
          newErrors.email = true;
        }
      }

      newErrors.general = errorMsg;
      setErrors(newErrors);
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title">Iniciar Sesión</h2>

        <div className="login__group">
          <label htmlFor="email" className="login__label">Correo Electrónico</label>
          <input
            type="text"
            id="email"
            name="email"
            value={user.email}
            placeholder="Usuario"
            className={`login__input ${errors.email ? "login__input--error" : ""}`}
            onChange={handleChange}
          />
        </div>

        <div className="login__group">
          <label htmlFor="password" className="login__label">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            placeholder="Contraseña"
            className={`login__input ${errors.password ? "login__input--error" : ""}`}
            onChange={handleChange}
          />
        </div>

        {errors.email && typeof errors.email === "string" && <p className="login__error">{errors.email}</p>}
        {errors.password && typeof errors.password === "string" && <p className="login__error">{errors.password}</p>}
        {errors.general && <p className="login__error">{errors.general}</p>}

        <button type="submit" className="login__button">
          {isLoading ? "Verificando..." : "Ingresar"}
        </button>

        <p className="login__register">
          ¿No tienes cuenta? <a href="/signup">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
