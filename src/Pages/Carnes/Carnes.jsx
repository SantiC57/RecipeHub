import React from "react";
import "./carnes.css";
import CarneAsada from "../../assets/carne-asada.jpg"; // Ruta corregida
import Picadillo from "../../assets/picadillo.jpg"; // Ruta corregida
import Estofado from "../../assets/estofado.jpg"; // Ruta corregida
import { Navbar } from "../../components/Navbar/Navbar"; // Asegúrate de que la ruta sea correcta
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar"; // Asegúrate de que la ruta sea correcta


const Carnes = () => {
  return (
    <>
      <Navbar />

      <h1 class="titulo" >Categorias Disponibles</h1>
      <FoodCategoryBar />
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
    </>
  );
};

export default Carnes;
