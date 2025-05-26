import React from "react";
import "./mariscos.css";
import Paella from "../../assets/paella.jpg"; // Ruta corregida
import CoctelCamaron from "../../assets/coctel-camaron.jpg"; // Ruta corregida
import ChupeCentolla from "../../assets/chupe-centolla.jpg"; // Ruta corregida
import { Navbar } from "../../components/Navbar/Navbar";
import FoodCategoryBar from "../../components/FoodCategoryBar/FoodCategoryBar";

const Mariscos = () => {
  return (
    <>
      <Navbar />

      <h1 class="titulo" >Categorias Disponibles</h1>
      <FoodCategoryBar />
      <div className="categoria">
        <h2 className="categoria__titulo">Recetas de Mariscos</h2>
        <div className="categoria__lista">
          <div className="receta">
            <img src={Paella} alt="Paella" />
            <h3>Paella</h3>
          </div>
          <div className="receta">
            <img src={CoctelCamaron} alt="Cóctel de Camarón" />
            <h3>Cóctel de Camarón</h3>
          </div>
          <div className="receta">
            <img src={ChupeCentolla} alt="Chupe de Centolla" />
            <h3>Chupe de Centolla</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mariscos;
