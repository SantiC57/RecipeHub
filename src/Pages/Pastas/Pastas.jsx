import React from "react";
import "./pastas.css";
import Spaghetti from "../../Images/spaghetti.jpg";
import Lasagna from "../../Images/lasaña.jpg";
import Carbonara from "../../Images/pasta-carbonara.jpg";

const Pastas = () => {
  return (
    <div className="categoria">
      <h2 className="categoria__titulo">Recetas de Pastas</h2>
      <div className="categoria__lista">
        <div className="receta">
          <img src={Spaghetti} alt="Spaghetti" />
          <h3>Spaghetti</h3>
        </div>
        <div className="receta">
          <img src={Lasagna} alt="Lasaña" />
          <h3>Lasaña</h3>
        </div>
        <div className="receta">
          <img src={Carbonara} alt="Pasta Carbonara" />
          <h3>Pasta Carbonara</h3>
        </div>
      </div>
    </div>
  );
};

export default Pastas;
