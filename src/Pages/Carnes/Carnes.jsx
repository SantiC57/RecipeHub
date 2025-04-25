import React from "react";
import "./carnes.css";
import CarneAsada from "../../images/carne-asada.jpg"; // Ruta corregida
import Picadillo from "../../images/picadillo.jpg"; // Ruta corregida
import Estofado from "../../images/estofado.jpg"; // Ruta corregida



const Carnes = () => {
  return (
    <div className="categoria">
      <h2 className="categoria__titulo">Recetas de Carnes</h2>
      <div className="categoria__lista">
        <div className="receta">
          <img src={CarneAsada} alt="Carne Asada" />
          <h3>Carne Asada</h3>
        </div>
        <div className="receta">
          <img src={Picadillo} alt="Picadillo" />
          <h3>Picadillo</h3>
        </div>
        <div className="receta">
          <img src={Estofado} alt="Estofado" />
          <h3>Estofado</h3>
        </div>
      </div>
    </div>
  );
};

export default Carnes;
