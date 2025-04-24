import React from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Asegúrate de que la ruta sea correcta

import user_icon from "../../assets/person.ico";
import email_icon from "../../assets/Email.ico";
import password_icon from "../../assets/Password.ico";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="header">
        <div className="text">Registro</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={user_icon} alt="Usuario" />
          <input type="text" placeholder="Nombre" />
        </div>
        <div className="input">
          <img src={email_icon} alt="Correo" />
          <input type="email" placeholder="Correo" />
        </div>
        <div className="input">
          <img src={password_icon} alt="Contraseña" />
          <input type="password" placeholder="Contraseña" />
        </div>
      </div>
      <div className="submit-container">
        <div className="submit" onClick={() => navigate("/signup")}>Registrarse</div>
      </div>
      <p className="register__login">
        ¿Ya tienes cuenta? <a href="/login">Inicia Sesion</a></p>
    </div>
  );
};

export default Signup;
