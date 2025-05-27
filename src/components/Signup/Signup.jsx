import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import user_icon from "../../assets/person.ico";
import email_icon from "../../assets/Email.ico";
import password_icon from "../../assets/Password.ico";
import api from "../../api/axiosConfig";
import { UserContext } from "../../Pages/context/UserContext"; // ← Asegúrate de usar la ruta correcta

const Signup = ({ onSubmit, selectedUser }) => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext); // ← usamos login del contexto
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setUser({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        password: selectedUser.password || ""
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!user.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!user.email.trim()) newErrors.email = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = "Correo electrónico inválido";
    if (!user.password) newErrors.password = "La contraseña es obligatoria";
    else if (user.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkUserExists = async () => {
    try {
      setIsChecking(true);
      const response = await api.get(`/usuarios/check-email?email=${encodeURIComponent(user.email)}`);
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el email:", error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userExists = await checkUserExists();
      if (userExists) {
        setErrors({ ...errors, email: "Este correo ya está registrado" });
        return;
      }

      // Crear usuario
      const newUser = await onSubmit(user);
      console.log("Usuario registrado correctamente:", newUser);

      // Login automático con el contexto global
      login(newUser); // ← Aquí usamos el contexto para hacer login

      // Limpiar y redirigir al home
      setUser({ name: "", email: "", password: "" });
      navigate("/");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setErrors({
        ...errors,
        general: "Error al registrar. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
        <div className="header">
          <div className="text">Registro</div>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          <div className={`input ${errors.name ? "input-wrapper-error" : ""}`}>
            <img src={user_icon} alt="Usuario" />
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={user.name}
              onChange={handleChange}
              required
              className={errors.name ? "input-error" : ""}
            />
          </div>

          <div className={`input ${errors.email ? "input-wrapper-error" : ""}`}>
            <img src={email_icon} alt="Correo" />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={`input ${errors.password ? "input-wrapper-error" : ""}`}>
            <img src={password_icon} alt="Contraseña" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={user.password}
              onChange={handleChange}
              required
              minLength="6"
              className={errors.password ? "input-error" : ""}
            />
          </div>

          {errors.name && <div className="error-message">{errors.name}</div>}
          {errors.email && <div className="error-message">{errors.email}</div>}
          {errors.password && <div className="error-message">{errors.password}</div>}
          {errors.general && <div className="error-message general">{errors.general}</div>}
        </div>

        <div className="submit-container">
          <button type="submit" className="submit" disabled={isChecking}>
            {isChecking ? "Verificando..." : "Registrarse"}
          </button>
        </div>

        <p className="register__login">
          ¿Ya tienes cuenta? <a href="/login">Inicia Sesión</a>
        </p>
      </div>
    </form>
  );
};

export default Signup;
