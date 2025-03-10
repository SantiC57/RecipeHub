import React from "react";
import './Signup.css'

import user_icon from '../../assets/person.ico';
import email_icon from '../../assets/Email.ico';
import password_icon from '../../assets/Password.ico';


const Signup = () => {
return (
    <div className="container">
        <div className="header">
            <div className="text">Registro</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <img src={user_icon} alt="" />
                <input type="text" placeholder="Nombre" />
            </div>
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" placeholder="Correo" />
            </div>
            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" placeholder="Contraseña" />
            </div>
        </div>
        <div className="submit-container">
            <div className="submit">Registrarse</div>
            <div className="submit">Inicio Sesion</div>
        </div>
    </div>


)


}

export default Signup;