import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./login.css"; 

const Login = () => {
  const navigate = useNavigate();
  
  return (
    <div className="login">
      <form className="login__form">
        <h2 className="login__title">Iniciar Sesión</h2>
        
        <div className="login__group">
          <label htmlFor="email" className="login__label">Correo Electrónico</label>
          <input type="email" id="email" className="login__input" name="email"/>
        </div>
        
        <div className="login__group">
          <label htmlFor="password" className="login__label">Contraseña</label>
          <input type="password" id="password" className="login__input" name="password"/>
        </div>
        
        <button type="submit" className="login__button" onClick={() => navigate("/")} >Ingresar</button>
        
        
        
        <p className="login__register">
        ¿No tienes cuenta? <a href="/signup">Regístrate</a></p>
      </form>
    </div>
  );
};

export default Login;
